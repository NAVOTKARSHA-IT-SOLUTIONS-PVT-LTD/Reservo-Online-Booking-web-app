package com.reservo.backend.repository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Repository;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.reservo.backend.entity.Resort;

@Repository
public class ResortRepository {

    private static final String COLLECTION = "resorts";

    private final Firestore firestore;

    public ResortRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    // =========================================================
    // SAVE
    // =========================================================

    public Resort save(Resort resort) {

        try {

            if (resort.getId() == null ||
                    resort.getId().isBlank()) {

                resort.setId(
                        firestore
                                .collection(COLLECTION)
                                .document()
                                .getId()
                );
            }

            if (resort.getCreatedAt() == null) {
                resort.setCreatedAt(Instant.now());
            }

            firestore
                    .collection(COLLECTION)
                    .document(resort.getId())
                    .set(resort)
                    .get();

            return resort;

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while saving resort",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to save resort",
                    e
            );
        }
    }

    // =========================================================
    // FIND BY ID
    // =========================================================

    public Optional<Resort> findById(String id) {

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

            Resort resort =
                    document.toObject(Resort.class);

            if (resort != null) {
                resort.setId(document.getId());
            }

            return Optional.ofNullable(resort);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while finding resort",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to find resort",
                    e
            );
        }
    }

    // =========================================================
    // FIND ALL
    // =========================================================

    public List<Resort> findAll() {

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
                    "Interrupted while loading resorts",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to load resorts",
                    e
            );
        }
    }

    // =========================================================
    // FIND BY STATUS
    // =========================================================

    public List<Resort> findByStatus(
            Resort.ResortStatus status
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
                    "Interrupted while finding resorts by status",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to find resorts by status",
                    e
            );
        }
    }

    // =========================================================
    // FIND BY OWNER
    // =========================================================

    public List<Resort> findByOwnerId(String ownerId) {

        try {

            List<QueryDocumentSnapshot> documents =
                    firestore
                            .collection(COLLECTION)
                            .whereEqualTo(
                                    "ownerId",
                                    ownerId
                            )
                            .get()
                            .get()
                            .getDocuments();

            return convertDocuments(documents);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while finding resorts by owner",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to find resorts by owner",
                    e
            );
        }
    }

    // =========================================================
    // SEARCH
    // =========================================================

    public List<Resort> search(
            String search
    ) {

        List<Resort> resorts = findAll();

        if (search == null || search.isBlank()) {
            return resorts;
        }

        String value =
                search.trim().toLowerCase();

        return resorts.stream()
                .filter(resort -> {

                    boolean nameMatch =
                            resort.getName() != null &&
                            resort.getName()
                                    .toLowerCase()
                                    .contains(value);

                    boolean locationMatch =
                            resort.getLocation() != null &&
                            resort.getLocation()
                                    .toLowerCase()
                                    .contains(value);

                    return nameMatch || locationMatch;
                })
                .toList();
    }

    // =========================================================
    // LOCATION SEARCH
    // =========================================================

    public List<Resort> findByLocationContainingIgnoreCase(
            String location
    ) {

        List<Resort> resorts = findAll();

        if (location == null || location.isBlank()) {
            return resorts;
        }

        String value =
                location.trim().toLowerCase();

        return resorts.stream()
                .filter(resort ->
                        resort.getLocation() != null &&
                        resort.getLocation()
                                .toLowerCase()
                                .contains(value)
                )
                .toList();
    }

    // =========================================================
    // NAME OR LOCATION SEARCH
    // =========================================================

    public List<Resort>
    findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(
            String name,
            String location
    ) {

        List<Resort> resorts = findAll();

        String nameValue =
                name == null
                        ? ""
                        : name.trim().toLowerCase();

        String locationValue =
                location == null
                        ? ""
                        : location.trim().toLowerCase();

        return resorts.stream()
                .filter(resort -> {

                    boolean nameMatch =
                            resort.getName() != null &&
                            resort.getName()
                                    .toLowerCase()
                                    .contains(nameValue);

                    boolean locationMatch =
                            resort.getLocation() != null &&
                            resort.getLocation()
                                    .toLowerCase()
                                    .contains(locationValue);

                    return nameMatch || locationMatch;
                })
                .toList();
    }

    // =========================================================
    // COUNT BY STATUS
    // =========================================================

    public long countByStatus(
            Resort.ResortStatus status
    ) {

        return findByStatus(status).size();
    }

    // =========================================================
    // DELETE
    // =========================================================

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
                    "Interrupted while deleting resort",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to delete resort",
                    e
            );
        }
    }

    // =========================================================
    // CONVERT DOCUMENTS
    // =========================================================

    private List<Resort> convertDocuments(
            List<QueryDocumentSnapshot> documents
    ) {

        List<Resort> resorts =
                new ArrayList<>();

        for (QueryDocumentSnapshot document :
                documents) {

            Resort resort =
                    document.toObject(Resort.class);

            if (resort != null) {

                resort.setId(
                        document.getId()
                );

                resorts.add(resort);
            }
        }

        return resorts;
    }
}