package com.reservo.backend.repository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Repository;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import java.util.Date;
import com.reservo.backend.entity.AiChatSession;

@Repository
public class AiChatSessionRepository {

    private static final String COLLECTION =
            "ai_chat_sessions";

    private final Firestore firestore;

    public AiChatSessionRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    /**
     * Save or update an AI chat session.
     */
    public AiChatSession save(AiChatSession session) {

        try {

            if (session.getId() == null ||
                    session.getId().isBlank()) {

                session.setId(
                        UUID.randomUUID().toString()
                );
            }

            if (session.getCreatedAt() == null) {
                session.setCreatedAt(Instant.now());
            }

            firestore
                    .collection(COLLECTION)
                    .document(session.getId())
                    .set(session)
                    .get();

            return session;

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Failed to save AI chat session",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to save AI chat session",
                    e
            );
        }
    }

    /**
     * Find session by Firestore document ID.
     */
    public Optional<AiChatSession> findById(
            String id
    ) {

        try {

            var document =
                    firestore
                            .collection(COLLECTION)
                            .document(id)
                            .get()
                            .get();

            if (!document.exists()) {
                return Optional.empty();
            }

            AiChatSession session = toSession(document);

            if (session != null) {
                session.setId(document.getId());
            }

            return Optional.ofNullable(session);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Failed to find AI chat session",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to find AI chat session",
                    e
            );
        }
    }

    /**
     * Find all sessions belonging to a user,
     * newest first.
     */
    public List<AiChatSession>
    findByUserIdOrderByCreatedAtDesc(
            String userId
    ) {

        try {

            List<QueryDocumentSnapshot> documents =
                    firestore
                            .collection(COLLECTION)
                            .whereEqualTo(
                                    "userId",
                                    userId
                            )
                            .orderBy(
                                    "createdAt",
                                    Query.Direction.DESCENDING
                            )
                            .get()
                            .get()
                            .getDocuments();

            List<AiChatSession> sessions =
                    new ArrayList<>();

            for (QueryDocumentSnapshot document :
                    documents) {

                AiChatSession session = toSession(document);

                if (session != null) {
                    session.setId(document.getId());
                    sessions.add(session);
                }
            }

            return sessions;

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Failed to load AI chat sessions",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to load AI chat sessions",
                    e
            );
        }
    }

    /**
     * Return all sessions.
     */
    public List<AiChatSession> findAll() {

        try {

            List<QueryDocumentSnapshot> documents =
                    firestore
                            .collection(COLLECTION)
                            .get()
                            .get()
                            .getDocuments();

            List<AiChatSession> sessions =
                    new ArrayList<>();

            for (QueryDocumentSnapshot document :
                    documents) {

                AiChatSession session = toSession(document);

                if (session != null) {
                    session.setId(document.getId());
                    sessions.add(session);
                }
            }

            return sessions;

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Failed to load AI chat sessions",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to load AI chat sessions",
                    e
            );
        }
    }


    /**
     * Firestore's Java bean mapper cannot reliably construct java.time.Instant.
     * Map the session fields explicitly and accept the common timestamp formats
     * already present in older ai_chat_sessions documents.
     */
    private AiChatSession toSession(com.google.cloud.firestore.DocumentSnapshot document) {
        AiChatSession session = new AiChatSession();
        session.setId(document.getId());
        session.setUserId(document.getString("userId"));
        session.setMood(document.getString("mood"));
        session.setCreatedAt(asInstant(document.get("createdAt")));
        return session;
    }

    private Instant asInstant(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Timestamp ts) {
            return ts.toSqlTimestamp().toInstant();
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
     * Delete a session.
     */
    public void deleteById(String id) {

        try {

            firestore
                    .collection(COLLECTION)
                    .document(id)
                    .delete()
                    .get();

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Failed to delete AI chat session",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to delete AI chat session",
                    e
            );
        }
    }

    public boolean existsById(String id) {
        return findById(id).isPresent();
    }
}