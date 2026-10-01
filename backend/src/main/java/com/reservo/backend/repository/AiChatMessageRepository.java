package com.reservo.backend.repository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Repository;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.reservo.backend.entity.AiChatMessage;

@Repository
public class AiChatMessageRepository {

    private static final String COLLECTION = "ai_chat_messages";

    private final Firestore firestore;

    public AiChatMessageRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    /**
     * Save or update an AI chat message.
     */
    public AiChatMessage save(AiChatMessage message) {
        try {
            if (message.getId() == null || message.getId().isBlank()) {
                message.setId(generateId());
            }

            if (message.getCreatedAt() == null) {
                message.setCreatedAt(Instant.now());
            }

            firestore.collection(COLLECTION)
                    .document(message.getId())
                    .set(message)
                    .get();

            return message;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to save AI chat message", e);
        } catch (ExecutionException e) {
            throw new RuntimeException("Failed to save AI chat message", e);
        }
    }

    /**
     * Find messages for a session, oldest first.
     *
     * Firestore's default bean mapper cannot reliably deserialize
     * java.time.Instant, so messages are mapped explicitly.
     */
    public List<AiChatMessage> findBySessionIdOrderByCreatedAtAsc(String sessionId) {
        try {
            List<QueryDocumentSnapshot> documents = firestore
                    .collection(COLLECTION)
                    .whereEqualTo("sessionId", sessionId)
                    .orderBy("createdAt", Query.Direction.ASCENDING)
                    .get()
                    .get()
                    .getDocuments();

            List<AiChatMessage> messages = new ArrayList<>();

            for (QueryDocumentSnapshot document : documents) {
                AiChatMessage message = toMessage(document);
                if (message != null) {
                    messages.add(message);
                }
            }

            return messages;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to load AI chat messages", e);
        } catch (ExecutionException e) {
            throw new RuntimeException("Failed to load AI chat messages", e);
        }
    }

    /**
     * Find message by Firestore document ID.
     */
    public Optional<AiChatMessage> findById(String id) {
        try {
            DocumentSnapshot document = firestore
                    .collection(COLLECTION)
                    .document(String.valueOf(id))
                    .get()
                    .get();

            if (!document.exists()) {
                return Optional.empty();
            }

            AiChatMessage message = toMessage(document);
            return Optional.ofNullable(message);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to find AI chat message", e);
        } catch (ExecutionException e) {
            throw new RuntimeException("Failed to find AI chat message", e);
        }
    }

    /**
     * Convert a Firestore document to AiChatMessage without relying on
     * Firestore's JavaBean conversion of java.time.Instant.
     */
    private AiChatMessage toMessage(DocumentSnapshot document) {
        AiChatMessage message = AiChatMessage.builder()
                .id(document.getId())
                .sessionId(document.getString("sessionId"))
                .sender(document.getString("sender"))
                .messageText(document.getString("messageText"))
                .recommendedResortId(document.getString("recommendedResortId"))
                .createdAt(asInstant(document.get("createdAt")))
                .build();

        if (message.getCreatedAt() == null) {
            message.setCreatedAt(Instant.now());
        }

        return message;
    }

    private Instant asInstant(Object value) {
        if (value == null) {
            return null;
        }

        if (value instanceof Timestamp timestamp) {
            return timestamp.toSqlTimestamp().toInstant();
        }

        if (value instanceof Date date) {
            return date.toInstant();
        }

        if (value instanceof Instant instant) {
            return instant;
        }

        if (value instanceof String text) {
            try {
                return Instant.parse(text);
            } catch (Exception ignored) {
                return null;
            }
        }

        return null;
    }

    /**
     * Delete message by ID.
     */
    public void deleteById(String id) {
        try {
            firestore.collection(COLLECTION)
                    .document(String.valueOf(id))
                    .delete()
                    .get();

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to delete AI chat message", e);
        } catch (ExecutionException e) {
            throw new RuntimeException("Failed to delete AI chat message", e);
        }
    }

    /**
     * Generate a Firestore document ID.
     */
    private String generateId() {
        return firestore.collection(COLLECTION).document().getId();
    }
}
