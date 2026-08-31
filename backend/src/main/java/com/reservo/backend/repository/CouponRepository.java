package com.reservo.backend.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Repository;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.reservo.backend.entity.Coupon;

@Repository
public class CouponRepository {

    private static final String COLLECTION = "coupons";

    private final Firestore firestore;

    public CouponRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    // =========================================================
    // SAVE / UPDATE
    // =========================================================

    public Coupon save(Coupon coupon) {

        try {

            if (coupon.getId() == null) {
                coupon.setId(generateId());
            }

            if (coupon.getCreatedAt() == null) {
                coupon.setCreatedAt(InstantHolder.now());
            }

            coupon.updateTimestamp();

            firestore
                    .collection(COLLECTION)
                    .document(String.valueOf(coupon.getId()))
                    .set(coupon)
                    .get();

            return coupon;

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while saving coupon",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to save coupon",
                    e
            );
        }
    }

    // =========================================================
    // FIND BY ID
    // =========================================================

    public Optional<Coupon> findById(String id) {

        try {

            var document =
                    firestore
                            .collection(COLLECTION)
                            .document(String.valueOf(id))
                            .get()
                            .get();

            if (!document.exists()) {
                return Optional.empty();
            }

            Coupon coupon =
                    document.toObject(Coupon.class);

            if (coupon != null && coupon.getId() == null) {
                coupon.setId(id);
            }

            return Optional.ofNullable(coupon);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while finding coupon",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to find coupon",
                    e
            );
        }
    }

    // =========================================================
    // FIND BY CODE
    // =========================================================

    public Optional<Coupon> findByCode(String code) {

        if (code == null || code.isBlank()) {
            return Optional.empty();
        }

        try {

            List<QueryDocumentSnapshot> documents =
                    firestore
                            .collection(COLLECTION)
                            .whereEqualTo(
                                    "code",
                                    code.trim().toUpperCase()
                            )
                            .limit(1)
                            .get()
                            .get()
                            .getDocuments();

            if (documents.isEmpty()) {
                return Optional.empty();
            }

            Coupon coupon =
                    documents.get(0)
                            .toObject(Coupon.class);

            if (coupon != null && coupon.getId() == null) {

                try {
                    coupon.setId(documents.get(0).getId());
                } catch (NumberFormatException ignored) {
                }
            }

            return Optional.ofNullable(coupon);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while finding coupon by code",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to find coupon by code",
                    e
            );
        }
    }

    // =========================================================
    // FIND BY CODE AND USER
    // =========================================================

    public Optional<Coupon> findByCodeAndUserId(
            String code,
            String userId
    ) {

        if (code == null || userId == null) {
            return Optional.empty();
        }

        try {

            List<QueryDocumentSnapshot> documents =
                    firestore
                            .collection(COLLECTION)
                            .whereEqualTo(
                                    "code",
                                    code.trim().toUpperCase()
                            )
                            .whereEqualTo(
                                    "userId",
                                    userId
                            )
                            .limit(1)
                            .get()
                            .get()
                            .getDocuments();

            if (documents.isEmpty()) {
                return Optional.empty();
            }

            Coupon coupon =
                    documents.get(0)
                            .toObject(Coupon.class);

            return Optional.ofNullable(coupon);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while finding user coupon",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to find user coupon",
                    e
            );
        }
    }

    // =========================================================
    // FIND ALL COUPONS FOR USER
    // =========================================================

    public List<Coupon> findByUserId(String userId) {

        try {

            List<QueryDocumentSnapshot> documents =
                    firestore
                            .collection(COLLECTION)
                            .whereEqualTo(
                                    "userId",
                                    userId
                            )
                            .get()
                            .get()
                            .getDocuments();

            return convertDocuments(documents);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while finding user coupons",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to find user coupons",
                    e
            );
        }
    }

    // =========================================================
    // FIND BY STATUS
    // =========================================================

    public List<Coupon> findByStatus(
            Coupon.CouponStatus status
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
                    "Interrupted while finding coupons by status",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to find coupons by status",
                    e
            );
        }
    }

    // =========================================================
    // COUNT USER COUPONS BY STATUS
    // =========================================================

    public long countByUserIdAndStatus(
            String userId,
            Coupon.CouponStatus status
    ) {

        try {

            List<QueryDocumentSnapshot> documents =
                    firestore
                            .collection(COLLECTION)
                            .whereEqualTo(
                                    "userId",
                                    userId
                            )
                            .whereEqualTo(
                                    "status",
                                    status.name()
                            )
                            .get()
                            .get()
                            .getDocuments();

            return documents.size();

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while counting coupons",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to count coupons",
                    e
            );
        }
    }

    // =========================================================
    // FIND ALL
    // =========================================================

    public long count() {
        try {
            return firestore.collection(COLLECTION).get().get().size();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted while counting coupons", e);
        } catch (java.util.concurrent.ExecutionException e) {
            throw new RuntimeException("Failed to count coupons", e);
        }
    }

    public List<Coupon> findAll() {

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
                    "Interrupted while loading coupons",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to load coupons",
                    e
            );
        }
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
                    "Interrupted while deleting coupon",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to delete coupon",
                    e
            );
        }
    }

    // =========================================================
    // CONVERT DOCUMENTS
    // =========================================================

    private List<Coupon> convertDocuments(
            List<QueryDocumentSnapshot> documents
    ) {

        List<Coupon> coupons = new ArrayList<>();

        for (QueryDocumentSnapshot document : documents) {

            Coupon coupon =
                    document.toObject(Coupon.class);

            if (coupon != null) {

                if (coupon.getId() == null) {

                    try {
                        coupon.setId(
                                document.getId()
                        );
                    } catch (NumberFormatException ignored) {
                    }
                }

                coupons.add(coupon);
            }
        }

        return coupons;
    }

    // =========================================================
    // GENERATE NUMERIC ID
    // =========================================================

    private String generateId() {
        return firestore.collection(COLLECTION).document().getId();
    }

    /**
     * Small helper to keep timestamp creation clean.
     */
    private static class InstantHolder {

        static java.time.Instant now() {
            return java.time.Instant.now();
        }
    }
}