package com.reservo.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reservo.backend.dto.AiChatRequest;
import com.reservo.backend.dto.AiChatResponse;
import com.reservo.backend.dto.AiItineraryRequest;
import com.reservo.backend.entity.AiChatMessage;
import com.reservo.backend.entity.AiChatSession;
import com.reservo.backend.entity.AiItinerary;
import com.reservo.backend.entity.Resort;
import com.reservo.backend.repository.AiChatMessageRepository;
import com.reservo.backend.repository.AiChatSessionRepository;
import com.reservo.backend.repository.AiItineraryRepository;
import com.reservo.backend.repository.ResortRepository;
import com.reservo.backend.repository.BookingRepository;
import com.reservo.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiService {

    private final AiChatSessionRepository sessionRepository;
    private final AiChatMessageRepository messageRepository;
    private final AiItineraryRepository itineraryRepository;
    private final ResortRepository resortRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    /**
     * Handles companion assistant queries. Logs interaction histories and attempts real-time LLM inference.
     */
    public AiChatResponse handleChat(AiChatRequest request) {
        String sessionId = request.getSessionId();
        if (sessionId == null || sessionId.trim().isEmpty()) {
            sessionId = "session-" + UUID.randomUUID().toString().substring(0, 8);
        }

        // Fetch or create session
        final String finalSessionId = sessionId;
        AiChatSession session = sessionRepository.findById(finalSessionId)
                .orElseGet(() -> {
                    AiChatSession s = AiChatSession.builder()
                            .id(finalSessionId)
                            .mood(request.getSelectedMood())
                            .build();
                    return sessionRepository.save(s);
                });

        activeChatSession.set(session.getId());

        // Save User Message
        AiChatMessage userMsg = AiChatMessage.builder()
                .sessionId(session.getId())
                .sender("user")
                .messageText(request.getMessage())
                .build();
        messageRepository.save(userMsg);

        // Formulate Response
        String responseText = "";
        Resort recommendation = null;

        // Try Gemini API first if configured
        if (geminiApiKey != null && !geminiApiKey.trim().isEmpty()) {
            try {
                responseText = queryGeminiModel(request.getMessage(), request.getSelectedMood());
            } catch (Exception e) {
                log.warn("Gemini API call failed, falling back to mock concierge engine: {}", e.getMessage());
                responseText = generateLocalMockReply(request.getMessage(), request.getSelectedMood());
            }
        } else {
            responseText = generateLocalMockReply(request.getMessage(), request.getSelectedMood());
        }

        // Map resort recommendations dynamically
        recommendation = scanAndMatchResort(request.getMessage() + " " + responseText);

        // Save Rivo Response Message
        AiChatMessage rivoMsg = AiChatMessage.builder()
                .sessionId(session.getId())
                .sender("rivo")
                .messageText(responseText)
                .recommendedResortId(recommendation != null ? recommendation.getId() : null)
                .build();
        messageRepository.save(rivoMsg);

        try {
            return new AiChatResponse(
                    "msg-" + UUID.randomUUID().toString().substring(0, 8),
                    "rivo",
                    responseText,
                    recommendation
            );
        } finally {
            activeChatSession.remove();
        }
    }

    /**
     * Generates a travel itinerary. Checks cache database prior to external LLM requests.
     */
    /**
     * Generates a travel itinerary. Checks cache database prior to external LLM requests.
     */
    public String generateItinerary(AiItineraryRequest request, String userEmail) {
        String dest = request.getDestination() == null ? "" : request.getDestination().trim();
        int days = request.getDays() == null ? 3 : Math.max(1, Math.min(request.getDays(), 14));
        String budget = request.getBudget() != null ? request.getBudget() : "luxury";

        List<com.reservo.backend.entity.Booking> userBookings = new ArrayList<>();
        if (userEmail != null && !userEmail.equalsIgnoreCase("anonymousUser")) {
            userRepository.findByEmail(userEmail).ifPresent(u -> {
                userBookings.addAll(bookingRepository.findByUserId(u.getId()));
            });
        }

        List<Resort> activeResorts = findApprovedResortsForDestination(dest);

        // Do not reuse old itinerary cache entries: resort inventory is live and can
        // change after approval/suspension, so every request must be generated from the
        // current approved inventory.
        // Resolve Itinerary JSON
        String itineraryJson = "";
        if (geminiApiKey != null && !geminiApiKey.trim().isEmpty()) {
            try {
                itineraryJson = queryGeminiItinerary(dest, days, request.getInterests(), budget, userBookings, activeResorts);
            } catch (Exception e) {
                log.warn("Gemini Itinerary Generation failed. Using mock planner fallback: {}", e.getMessage());
                itineraryJson = generateLocalMockItinerary(dest, days, budget);
            }
        } else {
            itineraryJson = generateLocalMockItinerary(dest, days, budget);
        }

        return itineraryJson;
    }

    /**
     * Retrieves previous sessions for a user
     */
    public List<AiChatSession> getUserSessions(String userId) {
        return sessionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // ── OUTBOUND REST QUERIES TO GEMINI API ───────────────────────────────────────────

    private String queryGeminiModel(String prompt, String mood) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

        // Load recent conversation first so short follow-ups such as
        // "I want 2 days" inherit the destination from the previous turns.
        List<AiChatMessage> history = Collections.emptyList();
        try {
            String historySessionId = findSessionIdForPrompt(prompt);
            if (!historySessionId.isBlank()) {
                history = messageRepository.findBySessionIdOrderByCreatedAtAsc(historySessionId);
            }
        } catch (Exception historyError) {
            log.debug("Chat history could not be loaded; continuing without history: {}", historyError.getMessage());
        }

        List<Resort> approved = resortRepository.findByStatus(Resort.ResortStatus.APPROVED);
        List<Resort> usableInventory = approved.stream()
                .filter(this::isUsableResort)
                .toList();

        // Do not send the entire Reservo inventory to Gemini when the user asked about
        // a specific destination/resort. This prevents answers such as "Goa resorts"
        // from listing Pune, Jaipur, null and other unrelated records.
        List<Resort> relevantInventory = findRelevantApprovedResorts(prompt, history, usableInventory);

        StringBuilder resortsCtx = new StringBuilder();
        resortsCtx.append("VERIFIED RESERVO PLATFORM INVENTORY. These are the ONLY resorts you may recommend, name, price, or claim availability for:\n");
        if (relevantInventory.isEmpty()) {
            resortsCtx.append("NO MATCHING APPROVED RESORTS ARE CURRENTLY AVAILABLE FOR THIS REQUEST.\n");
        } else {
            for (Resort r : relevantInventory) {
                resortsCtx.append(resortContext(r)).append("\n");
            }
        }

        StringBuilder historyCtx = new StringBuilder();
        if (!history.isEmpty()) {
            historyCtx.append("RECENT CONVERSATION:\n");
            history.stream().skip(Math.max(0, history.size() - 10)).forEach(m ->
                    historyCtx.append(m.getSender()).append(": ").append(safe(m.getMessageText())).append("\n"));
        }

        String systemContext = """
                You are Rivo, the AI travel assistant inside Reservo.
                Your job is to answer the user's question helpfully, accurately and naturally.

                HARD RESERVO RULES:
                1. Reservo is a resort booking platform. When discussing stays, bookings, prices,
                   resort availability, amenities, or recommendations, use ONLY the verified
                   Reservo inventory supplied below.
                2. NEVER invent a resort, room, price, rating, amenity, discount, availability,
                   booking, policy, address, phone number, or website detail.
                3. If the user asks for a destination where the supplied inventory has no approved
                   matching resort, say so clearly. Do not substitute an outside hotel.
                4. You may answer general travel questions from general knowledge, but clearly
                   distinguish general destination suggestions from Reservo inventory.
                5. For an itinerary, accommodation MUST be an approved Reservo resort from the
                   supplied inventory. Other attractions/activities are general suggestions unless
                   the supplied resort data explicitly confirms them.
                6. Never claim an activity is provided by a resort unless the supplied data says so.
                7. IMPORTANT CONVERSATION MEMORY: if the latest user message only changes duration,
                   budget, guest count, interests, or another trip detail, inherit the destination
                   and other still-valid details from the recent conversation. Do NOT ask for the
                   destination again when it is already clear from the conversation.
                8. If a genuinely required detail is missing and cannot be inferred from the recent
                   conversation, ask one short clarifying question.
                9. When the user asks for a resort list for a destination, list ONLY matching
                   Reservo resorts. Do not list resorts from other cities/states.
                10. Skip incomplete inventory records. Never display null resort names, null
                    locations, or null prices.
                11. When the user asks for an itinerary, give a useful day-by-day plan in the
                    response itself: Day 1, Day 2, etc., with practical time/activity suggestions,
                    accommodation, and a clear note that attractions are general suggestions unless
                    verified by Reservo. Do not reply with only "I've created an itinerary".
                12. If the user provides a budget, use it as a constraint and do not invent a
                    total activity cost. State the verified accommodation cost separately when it
                    can be calculated from the supplied nightly price and number of nights.

                VERIFIED INVENTORY:
                """ + resortsCtx + "\nMOOD: " + safe(mood) + "\n" + historyCtx +
                "\nCURRENT USER QUESTION: " + safe(prompt);

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> contentMap = new HashMap<>();
        Map<String, Object> partMap = new HashMap<>();
        partMap.put("text", systemContext);
        contentMap.put("parts", Collections.singletonList(partMap));
        requestBody.put("contents", Collections.singletonList(contentMap));

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.2);
        generationConfig.put("maxOutputTokens", 1800);
        requestBody.put("generationConfig", generationConfig);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);
        return parseTextFromGeminiResponse(response);
    }

    /**
     * The current chat method stores the user message before calling the model, so the
     * model history can be loaded by session id. This helper is intentionally simple:
     * the actual session id is embedded in the current request by handleChat through
     * the thread-local below.
     */
    private final ThreadLocal<String> activeChatSession = new ThreadLocal<>();

    private String findSessionIdForPrompt(String ignoredPrompt) {
        String id = activeChatSession.get();
        return id == null ? "" : id;
    }

    private String queryGeminiItinerary(String dest, int days, List<String> interests, String budget,
                                        List<com.reservo.backend.entity.Booking> bookings,
                                        List<Resort> resorts) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

        if (days < 1) days = 1;
        if (days > 14) days = 14;

        StringBuilder context = new StringBuilder();
        context.append("""
                You are Rivo, Reservo's itinerary planner.
                Generate a practical travel itinerary using the verified Reservo data below.

                NON-NEGOTIABLE:
                - Accommodation recommendations MUST come only from the supplied approved Reservo resorts.
                - Never create or rename a resort.
                - Never invent a resort price, rating, room type, amenity or availability.
                - If there is no approved resort matching the requested destination, set
                  accommodationAvailable=false and explain that Reservo has no approved
                  matching resort at the moment.
                - Activities may be general destination activities, but do not claim that
                  Reservo provides them unless the resort data explicitly supports them.
                - If a booked Reservo resort is supplied, use that booking as the accommodation.
                - Keep the plan realistic and avoid impossible travel schedules.
                """);

        if (resorts != null && !resorts.isEmpty()) {
            context.append("\nAPPROVED RESERVO RESORTS:\n");
            for (Resort r : resorts) {
                context.append(resortContext(r)).append("\n");
            }
        } else {
            context.append("\nAPPROVED RESERVO RESORTS: NONE MATCH THE REQUESTED DESTINATION.\n");
        }

        if (bookings != null && !bookings.isEmpty()) {
            context.append("\nUSER'S EXISTING BOOKINGS:\n");
            for (com.reservo.backend.entity.Booking b : bookings) {
                if (b.getResortId() != null) {
                    Resort bookedResort = resortRepository.findById(b.getResortId()).orElse(null);
                    if (bookedResort != null) {
                        context.append("- ").append(bookedResort.getName())
                                .append(" at ").append(safe(bookedResort.getLocation()))
                                .append(" from ").append(b.getCheckInDate())
                                .append(" to ").append(b.getCheckOutDate()).append("\n");
                    }
                }
            }
        }

        String promptText = context +
                "\nDestination: " + safe(dest) +
                "\nDays: " + days +
                "\nInterests: " + (interests == null ? "not specified" : String.join(", ", interests)) +
                "\nBudget: " + safe(budget) +
                "\nReturn only the requested JSON object.";

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> contentMap = new HashMap<>();
        Map<String, Object> partMap = new HashMap<>();
        partMap.put("text", promptText);
        contentMap.put("parts", Collections.singletonList(partMap));
        requestBody.put("contents", Collections.singletonList(contentMap));

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("responseMimeType", "application/json");
        generationConfig.put("temperature", 0.15);

        Map<String, Object> schema = itinerarySchema();
        generationConfig.put("responseSchema", schema);
        requestBody.put("generationConfig", generationConfig);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);
        return parseTextFromGeminiResponse(response);
    }

    /**
     * Extracts the generated text from a Gemini generateContent response.
     * Gemini returns text under candidates[0].content.parts[*].text.
     */
    @SuppressWarnings("unchecked")
    private String parseTextFromGeminiResponse(Map<String, Object> response) {
        if (response == null) {
            throw new IllegalStateException("Gemini returned an empty response");
        }

        Object candidatesObj = response.get("candidates");
        if (!(candidatesObj instanceof List)) {
            Object error = response.get("error");
            throw new IllegalStateException("Gemini response did not contain candidates"
                    + (error != null ? ": " + error : ""));
        }

        List<?> candidates = (List<?>) candidatesObj;
        if (candidates.isEmpty() || !(candidates.get(0) instanceof Map)) {
            throw new IllegalStateException("Gemini returned no usable candidates");
        }

        Map<String, Object> candidate = (Map<String, Object>) candidates.get(0);
        Object contentObj = candidate.get("content");
        if (!(contentObj instanceof Map)) {
            throw new IllegalStateException("Gemini response contained no content");
        }

        Map<String, Object> content = (Map<String, Object>) contentObj;
        Object partsObj = content.get("parts");
        if (!(partsObj instanceof List)) {
            throw new IllegalStateException("Gemini response contained no parts");
        }

        StringBuilder text = new StringBuilder();
        for (Object partObj : (List<?>) partsObj) {
            if (partObj instanceof Map) {
                Object partText = ((Map<String, Object>) partObj).get("text");
                if (partText != null) {
                    if (text.length() > 0) text.append('\n');
                    text.append(partText);
                }
            }
        }

        if (text.length() == 0) {
            throw new IllegalStateException("Gemini returned an empty text response");
        }

        return text.toString().trim();
    }

    private Map<String, Object> itinerarySchema() {
        Map<String, Object> schema = new HashMap<>();
        schema.put("type", "OBJECT");
        Map<String, Object> props = new HashMap<>();
        props.put("destination", Map.of("type", "STRING"));
        props.put("days", Map.of("type", "INTEGER"));
        props.put("accommodationAvailable", Map.of("type", "BOOLEAN"));
        props.put("resortId", Map.of("type", "STRING"));
        props.put("resortName", Map.of("type", "STRING"));
        props.put("resortLocation", Map.of("type", "STRING"));
        props.put("accommodationNote", Map.of("type", "STRING"));

        Map<String, Object> timelineSchema = new HashMap<>();
        timelineSchema.put("type", "ARRAY");
        Map<String, Object> timelineItem = new HashMap<>();
        timelineItem.put("type", "OBJECT");
        Map<String, Object> timelineProps = new HashMap<>();
        timelineProps.put("day", Map.of("type", "INTEGER"));
        timelineProps.put("theme", Map.of("type", "STRING"));

        Map<String, Object> activitiesSchema = new HashMap<>();
        activitiesSchema.put("type", "ARRAY");
        Map<String, Object> activityItem = new HashMap<>();
        activityItem.put("type", "OBJECT");
        activityItem.put("properties", Map.of(
                "time", Map.of("type", "STRING"),
                "title", Map.of("type", "STRING"),
                "description", Map.of("type", "STRING"),
                "source", Map.of("type", "STRING")
        ));
        activitiesSchema.put("items", activityItem);
        timelineProps.put("activities", activitiesSchema);
        timelineItem.put("properties", timelineProps);
        timelineSchema.put("items", timelineItem);
        props.put("timeline", timelineSchema);

        schema.put("properties", props);
        return schema;
    }

    private String resortContext(Resort r) {
        return "- RESORT_ID=" + safe(r.getId()) +
                " | name=" + safe(r.getName()) +
                " | location=" + safe(r.getLocation()) +
                " | city=" + safe(r.getCity()) +
                " | state=" + safe(r.getState()) +
                " | pricePerNight=" + String.valueOf(r.getPricePerNight()) +
                " | rating=" + String.valueOf(r.getRating()) +
                " | guests=" + String.valueOf(r.getGuests()) +
                " | bedrooms=" + String.valueOf(r.getBedrooms()) +
                " | category=" + safe(r.getCategory()) +
                " | description=" + safe(r.getDescription()) +
                " | amenities=" + safe(r.getAmenities()) +
                " | highlights=" + safe(r.getHighlights()) +
                " | listingMode=" + safe(r.getListingMode());
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    // ── LOCAL MOCK FALLBACK ENGINES ──────────────────────────────────────────────────

    private String generateLocalMockReply(String message, String mood) {
        String msg = safe(message).toLowerCase(Locale.ROOT);
        List<Resort> approved = resortRepository.findByStatus(Resort.ResortStatus.APPROVED)
                .stream().filter(this::isUsableResort).toList();

        if (approved.isEmpty()) {
            return "I can help with travel planning, but Reservo currently has no complete approved resort records available to recommend. You can still ask me general travel questions.";
        }

        if (msg.contains("hello") || msg.equals("hi") || msg.startsWith("hi ")) {
            return "Hi! I'm Rivo 👋 I can answer travel questions, compare approved Reservo resorts, and create day-by-day itineraries using Reservo properties.";
        }

        if (msg.contains("available") || msg.contains("resort") || msg.contains("list") || msg.contains("stay")) {
            List<Resort> matches = findRelevantApprovedResorts(message, Collections.emptyList(), approved);
            List<Resort> toShow = matches.isEmpty() ? approved : matches;
            StringBuilder sb = new StringBuilder();
            sb.append(matches.isEmpty()
                    ? "Here are the currently approved Reservo resorts:\n"
                    : "Here are the approved Reservo resorts matching your request:\n");
            for (Resort r : toShow) {
                sb.append("• ").append(safe(r.getName()))
                        .append(" — ").append(displayLocation(r))
                        .append(" — ₹").append(String.valueOf(r.getPricePerNight())).append("/night\n");
            }
            return sb.toString().trim();
        }

        for (Resort r : approved) {
            String name = safe(r.getName()).toLowerCase(Locale.ROOT);
            String location = safe(r.getLocation()).toLowerCase(Locale.ROOT);
            String city = safe(r.getCity()).toLowerCase(Locale.ROOT);
            if ((!name.isBlank() && msg.contains(name))
                    || (!location.isBlank() && msg.contains(location))
                    || (!city.isBlank() && msg.contains(city))) {
                return "Yes — " + safe(r.getName()) + " is an approved Reservo property in " +
                        displayLocation(r) + ". Its listed price is ₹" + r.getPricePerNight() + " per night.";
            }
        }

        return "I can help with Reservo resort information, trip planning, budgets, amenities, bookings and general travel questions. Tell me what you want to plan or ask.";
    }

    private Resort scanAndMatchResort(String text) {
        String checkText = safe(text).toLowerCase(Locale.ROOT);
        List<Resort> approved = resortRepository.findByStatus(Resort.ResortStatus.APPROVED);
        for (Resort r : approved) {
            if (!isUsableResort(r)) continue;
            String name = safe(r.getName()).toLowerCase(Locale.ROOT).trim();
            String location = safe(r.getLocation()).toLowerCase(Locale.ROOT).trim();
            String city = safe(r.getCity()).toLowerCase(Locale.ROOT).trim();
            String state = safe(r.getState()).toLowerCase(Locale.ROOT).trim();
            if ((!name.isBlank() && checkText.contains(name))
                    || (!location.isBlank() && checkText.contains(location))
                    || (!city.isBlank() && checkText.contains(city))
                    || (!state.isBlank() && checkText.contains(state))) {
                return r;
            }
        }
        return null;
    }

    /**
     * Returns only approved Reservo resorts matching the requested destination.
     * This deliberately filters the live inventory in memory so suspended/pending
     * properties can never be recommended by Rivo.
     */
    private List<Resort> findApprovedResortsForDestination(String destination) {
        String query = safe(destination).trim().toLowerCase(Locale.ROOT);
        if (query.isBlank()) return Collections.emptyList();

        List<Resort> approved = resortRepository.findByStatus(Resort.ResortStatus.APPROVED);
        List<Resort> matches = new ArrayList<>();
        for (Resort r : approved) {
            if (!isUsableResort(r)) continue;
            String name = safe(r.getName()).toLowerCase(Locale.ROOT);
            String location = safe(r.getLocation()).toLowerCase(Locale.ROOT);
            String city = safe(r.getCity()).toLowerCase(Locale.ROOT);
            String state = safe(r.getState()).toLowerCase(Locale.ROOT);
            if ((!name.isBlank() && name.contains(query))
                    || (!location.isBlank() && location.contains(query))
                    || (!city.isBlank() && city.contains(query))
                    || (!state.isBlank() && state.contains(query))) {
                matches.add(r);
            }
        }
        return matches;
    }

    private boolean isUsableResort(Resort r) {
        if (r == null) return false;
        if (safe(r.getId()).isBlank()) return false;
        if (safe(r.getName()).isBlank()) return false;
        if (safe(r.getLocation()).isBlank() && safe(r.getCity()).isBlank() && safe(r.getState()).isBlank()) return false;
        return r.getPricePerNight() != null;
    }

    private String displayLocation(Resort r) {
        if (!safe(r.getLocation()).isBlank()) return safe(r.getLocation());
        String city = safe(r.getCity());
        String state = safe(r.getState());
        if (!city.isBlank() && !state.isBlank()) return city + ", " + state;
        return !city.isBlank() ? city : state;
    }

    /**
     * Finds the inventory relevant to the current request and recent conversation.
     * Matching against known resort city/state/location/name keeps Gemini grounded
     * in the destination the user is actually discussing.
     */
    private List<Resort> findRelevantApprovedResorts(String prompt, List<AiChatMessage> history, List<Resort> approved) {
        String combined = safe(prompt).toLowerCase(Locale.ROOT);
        if (history != null) {
            history.stream().skip(Math.max(0, history.size() - 10)).forEach(m -> {
                // handled below by building a second string without mutating a lambda target
            });
            StringBuilder historyText = new StringBuilder(combined);
            for (AiChatMessage m : history) {
                if (m != null) historyText.append(" ").append(safe(m.getMessageText()).toLowerCase(Locale.ROOT));
            }
            combined = historyText.toString();
        }

        LinkedHashSet<String> locationTokens = new LinkedHashSet<>();
        for (Resort r : approved) {
            if (r == null) continue;
            addTokenIfMentioned(locationTokens, combined, r.getCity());
            addTokenIfMentioned(locationTokens, combined, r.getState());
            addTokenIfMentioned(locationTokens, combined, r.getLocation());
        }

        // If a specific resort name is mentioned, keep that resort even if its city
        // isn't mentioned explicitly.
        LinkedHashSet<Resort> matches = new LinkedHashSet<>();
        for (Resort r : approved) {
            if (r == null) continue;
            String name = safe(r.getName()).toLowerCase(Locale.ROOT).trim();
            if (!name.isBlank() && combined.contains(name)) matches.add(r);
        }

        for (String token : locationTokens) {
            for (Resort r : approved) {
                if (containsIgnoreCase(r.getCity(), token)
                        || containsIgnoreCase(r.getState(), token)
                        || containsIgnoreCase(r.getLocation(), token)
                        || containsIgnoreCase(r.getName(), token)) {
                    matches.add(r);
                }
            }
        }

        if (!matches.isEmpty()) return new ArrayList<>(matches);
        return new ArrayList<>(approved);
    }

    private void addTokenIfMentioned(Set<String> tokens, String combined, String value) {
        String normalized = safe(value).toLowerCase(Locale.ROOT).trim();
        if (!normalized.isBlank() && combined.contains(normalized)) {
            tokens.add(normalized);
        }
        // Also use the first part of "City, State" locations.
        if (normalized.contains(",")) {
            String first = normalized.split(",", 2)[0].trim();
            if (!first.isBlank() && combined.contains(first)) tokens.add(first);
        }
    }

    private boolean containsIgnoreCase(String value, String token) {
        String v = safe(value).toLowerCase(Locale.ROOT);
        return !token.isBlank() && v.contains(token);
    }

    private String generateLocalMockItinerary(String dest, int days, String budget) {
        List<Resort> matches = findApprovedResortsForDestination(dest);
        Resort selected = matches.isEmpty() ? null : matches.get(0);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("destination", dest);
        result.put("days", Math.max(1, Math.min(days, 14)));
        result.put("accommodationAvailable", selected != null);
        result.put("resortId", selected == null ? "" : safe(selected.getId()));
        result.put("resortName", selected == null ? "" : safe(selected.getName()));
        result.put("resortLocation", selected == null ? "" : safe(selected.getLocation()));
        result.put("accommodationNote", selected == null
                ? "Reservo currently has no approved resort matching this destination."
                : "Accommodation is selected only from Reservo's approved resort inventory.");

        List<Map<String, Object>> timeline = new ArrayList<>();
        for (int d = 1; d <= Math.max(1, Math.min(days, 14)); d++) {
            Map<String, Object> day = new LinkedHashMap<>();
            day.put("day", d);
            day.put("theme", d == 1 ? "Arrival & Resort Check-in" : (d == days ? "Leisure & Departure" : "Explore & Relax"));

            List<Map<String, String>> activities = new ArrayList<>();
            if (d == 1) {
                activities.add(activity("12:00 PM", "Arrival & Check-in",
                        selected == null ? "Arrive at the destination and choose from available local options." :
                                "Check in at " + safe(selected.getName()) + ". Follow the property's confirmed check-in instructions.", "Reservo"));
                activities.add(activity("03:00 PM", "Relaxation",
                        selected == null ? "Relax after arrival." : "Enjoy the resort's listed amenities.", "General"));
            } else if (d == days) {
                activities.add(activity("09:00 AM", "Breakfast & Leisure",
                        selected == null ? "Enjoy a relaxed morning." : "Enjoy your morning at " + safe(selected.getName()) + ".", "General"));
                activities.add(activity("12:00 PM", "Check-out / Departure",
                        "Complete check-out and continue your onward journey.", "General"));
            } else {
                activities.add(activity("09:00 AM", "Morning Exploration",
                        "Explore nearby attractions suitable for your interests; confirm opening hours before visiting.", "General"));
                activities.add(activity("05:00 PM", "Resort Leisure",
                        selected == null ? "Return to your accommodation and relax." :
                                "Return to " + safe(selected.getName()) + " and enjoy its listed amenities.", "General"));
            }
            day.put("activities", activities);
            timeline.add(day);
        }
        result.put("timeline", timeline);

        try {
            return objectMapper.writeValueAsString(result);
        } catch (Exception e) {
            throw new RuntimeException("Unable to build fallback itinerary", e);
        }
    }

    private Map<String, String> activity(String time, String title, String description, String source) {
        Map<String, String> a = new LinkedHashMap<>();
        a.put("time", time);
        a.put("title", title);
        a.put("description", description);
        a.put("source", source);
        return a;
    }

}
