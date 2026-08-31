package com.reservo.backend.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Repository;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.reservo.backend.entity.Room;

@Repository
public class RoomRepository {

    private static final String COLLECTION = "rooms";

    private final Firestore firestore;

    public RoomRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    // =========================================================
    // SAVE / UPDATE
    // =========================================================

    public Room save(Room room) {

        try {

            if (room.getId() == null) {
                room.setId(generateId());
            }

            if (room.getCreatedAt() == null) {
                room.setCreatedAt(java.time.Instant.now());
            }

            room.updateTimestamp();

            firestore
                    .collection(COLLECTION)
                    .document(String.valueOf(room.getId()))
                    .set(room)
                    .get();

            return room;

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while saving room",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to save room",
                    e
            );
        }
    }

    // =========================================================
    // FIND BY ID
    // =========================================================

    public java.util.Optional<Room> findById(String id) {

        try {
            var document = firestore.collection(COLLECTION)
                    .document(id)
                    .get()
                    .get();

            if (!document.exists()) {
                return java.util.Optional.empty();
            }

            Room room = document.toObject(Room.class);
            if (room != null && room.getId() == null) {
                room.setId(document.getId());
            }

            return java.util.Optional.ofNullable(room);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted while finding room", e);
        } catch (java.util.concurrent.ExecutionException e) {
            throw new RuntimeException("Failed to find room", e);
        }
    }

    // =========================================================
    // FIND ALL
    // =========================================================

    public List<Room> findAll() {

        try {

            List<QueryDocumentSnapshot> documents =
                    firestore
                            .collection(COLLECTION)
                            .get()
                            .get()
                            .getDocuments();

            return convertDocuments(documents);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while loading rooms",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to load rooms",
                    e
            );
        }
    }

    // =========================================================
    // FIND BY RESORT
    // =========================================================

    public List<Room> findByResortId(String resortId) {

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

        return convertDocuments(documents);

    } catch (InterruptedException e) {

        Thread.currentThread().interrupt();

        throw new RuntimeException(
                "Interrupted while finding rooms for resort",
                e
        );

    } catch (ExecutionException e) {

        throw new RuntimeException(
                "Failed to find rooms for resort",
                e
        );
    }
}

    // =========================================================
    // FIND BY STATUS
    // =========================================================

    public List<Room> findByStatus(
            Room.RoomStatus status
    ) {

        try {

            List<QueryDocumentSnapshot> documents =
                    firestore
                            .collection(COLLECTION)
                            .whereEqualTo(
                                    "status",
                                    status.name()
                            )
                            .get()
                            .get()
                            .getDocuments();

            return convertDocuments(documents);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while finding rooms by status",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to find rooms by status",
                    e
            );
        }
    }

    // =========================================================
    // COUNT BY STATUS
    // =========================================================

    public long countByStatus(
            Room.RoomStatus status
    ) {

        return findByStatus(status).size();
    }

    // =========================================================
    // EXISTS
    // =========================================================

    public boolean existsById(String id) {
        return findById(id).isPresent();
    }

    // =========================================================
    // DELETE
    // =========================================================

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
                    "Interrupted while deleting room",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to delete room",
                    e
            );
        }
    }

    // =========================================================
    // CONVERT DOCUMENTS
    // =========================================================

    private List<Room> convertDocuments(
            List<QueryDocumentSnapshot> documents
    ) {

        List<Room> rooms =
                new ArrayList<>();

        for (QueryDocumentSnapshot document :
                documents) {

            Room room =
                    document.toObject(Room.class);

            if (room != null) {

                /*
                 * The application uses Long IDs.
                 *
                 * If the document ID is numeric,
                 * restore it into the entity.
                 */
                if (room.getId() == null) {

                    try {
                        room.setId(
                                document.getId()
                        );
                    } catch (NumberFormatException ignored) {
                        // Keep the value from Firestore
                    }
                }

                rooms.add(room);
            }
        }

        return rooms;
    }

    // =========================================================
    // GENERATE NUMERIC ID
    // =========================================================

    private String generateId() {
        return firestore.collection(COLLECTION).document().getId();
    }
}