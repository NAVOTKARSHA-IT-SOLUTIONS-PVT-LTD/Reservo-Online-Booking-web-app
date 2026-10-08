package com.reservo.backend.repository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Repository;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.reservo.backend.entity.ResortPost;

@Repository
public class ResortPostRepository {

    private static final String COLLECTION = "resort_posts";

    private final Firestore firestore;

    public ResortPostRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    /**
     * Save a new post or update an existing post.
     */
    public ResortPost save(ResortPost post) {

        try {

            if (post.getId() == null) {
                post.setId(generateId());
            }

            if (post.getCreatedAt() == null) {
                post.setCreatedAt(Instant.now());
            }

            firestore
                    .collection(COLLECTION)
                    .document(String.valueOf(post.getId()))
                    .set(post)
                    .get();

            return post;

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while saving resort post",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to save resort post",
                    e
            );
        }
    }

    /**
     * Find a post by ID.
     */
    public Optional<ResortPost> findById(String id) {

        try {

            DocumentSnapshot snapshot =
                    firestore
                            .collection(COLLECTION)
                            .document(String.valueOf(id))
                            .get()
                            .get();

            if (!snapshot.exists()) {
                return Optional.empty();
            }

            ResortPost post =
                    snapshot.toObject(ResortPost.class);

            return Optional.ofNullable(post);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while finding resort post",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to find resort post",
                    e
            );
        }
    }

    /**
     * Get posts for a specific resort,
     * newest first.
     */
    public List<ResortPost>
    findByResortIdOrderByCreatedAtDesc(String resortId) {

        try {

            List<QueryDocumentSnapshot> documents =
                    firestore
                            .collection(COLLECTION)
                            .whereEqualTo(
                                    "resortId",
                                    resortId
                            )
                            .get()
                            .get()
                            .getDocuments();

            List<ResortPost> posts =
                    new ArrayList<>();

            for (QueryDocumentSnapshot document : documents) {

                ResortPost post =
                        document.toObject(ResortPost.class);

                if (post != null) {

                    if (post.getId() == null) {
                        try {
                            post.setId(
                                    document.getId()
                            );
                        } catch (Exception ignored) {
                        }
                    }

                    posts.add(post);
                }
            }

            // In-memory sort (avoids missing Firestore composite index error)
            posts.sort((a, b) -> {
                if (a.getCreatedAt() == null && b.getCreatedAt() == null) return 0;
                if (a.getCreatedAt() == null) return 1;
                if (b.getCreatedAt() == null) return -1;
                return b.getCreatedAt().compareTo(a.getCreatedAt());
            });

            return posts;

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();
            return new ArrayList<>();

        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    /**
     * Get all resort posts.
     */
    public List<ResortPost> findAll() {

        try {

            List<QueryDocumentSnapshot> documents =
                    firestore
                            .collection(COLLECTION)
                            .get()
                            .get()
                            .getDocuments();

            List<ResortPost> posts =
                    new ArrayList<>();

            for (QueryDocumentSnapshot document : documents) {

                ResortPost post =
                        document.toObject(ResortPost.class);

                if (post != null) {

                    if (post.getId() == null) {
                        try {
                            post.setId(
                                    document.getId()
                            );
                        } catch (NumberFormatException ignored) {
                        }
                    }

                    posts.add(post);
                }
            }

            return posts;

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while loading resort posts",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to load resort posts",
                    e
            );
        }
    }

    /**
     * Delete a post by ID.
     */
    public void deleteById(String id) {

        try {

            firestore
                    .collection(COLLECTION)
                    .document(String.valueOf(id))
                    .delete()
                    .get();

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while deleting resort post",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to delete resort post",
                    e
            );
        }
    }

    /**
     * Generate the next numeric ID.
     *
     * This preserves Long IDs used by the
     * existing Reservo application.
     */
    private String generateId() {
        return firestore.collection(COLLECTION).document().getId();
    }
}