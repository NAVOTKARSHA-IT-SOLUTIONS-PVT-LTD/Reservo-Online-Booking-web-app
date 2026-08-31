package com.reservo.backend.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Repository;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.reservo.backend.entity.Payment;

@Repository
public class PaymentRepository {

    private static final String COLLECTION = "payments";

    private final Firestore firestore;

    public PaymentRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    /**
     * Save or update a payment.
     */
    public Payment save(Payment payment) {

        try {

            if (payment.getId() == null) {
                payment.setId(generateId());
            }

            if (payment.getCreatedAt() == null) {
                payment.setCreatedAt(
                        java.time.Instant.now()
                );
            }

            firestore
                    .collection(COLLECTION)
                    .document(String.valueOf(payment.getId()))
                    .set(payment)
                    .get();

            return payment;

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Failed to save payment",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to save payment",
                    e
            );
        }
    }

    /**
     * Find payment by ID.
     */
    public Optional<Payment> findById(String id) {

        try {

            DocumentSnapshot document =
                    firestore
                            .collection(COLLECTION)
                            .document(String.valueOf(id))
                            .get()
                            .get();

            if (!document.exists()) {
                return Optional.empty();
            }

            Payment payment =
                    document.toObject(Payment.class);

            return Optional.ofNullable(payment);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Failed to find payment",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to find payment",
                    e
            );
        }
    }

    /**
     * Find payment by transaction ID.
     */
    public Optional<Payment> findByTransactionId(
            String transactionId
    ) {

        try {

            List<QueryDocumentSnapshot> documents =
                    firestore
                            .collection(COLLECTION)
                            .whereEqualTo(
                                    "transactionId",
                                    transactionId
                            )
                            .limit(1)
                            .get()
                            .get()
                            .getDocuments();

            if (documents.isEmpty()) {
                return Optional.empty();
            }

            Payment payment =
                    documents.get(0)
                            .toObject(Payment.class);

            return Optional.ofNullable(payment);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Failed to find payment by transaction ID",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to find payment by transaction ID",
                    e
            );
        }
    }

    /**
     * Find payment belonging to a booking.
     */
    public Optional<Payment> findByBookingId(
            String bookingId
    ) {

        try {

            List<QueryDocumentSnapshot> documents =
                    firestore
                            .collection(COLLECTION)
                            .whereEqualTo(
                                    "bookingId",
                                    bookingId
                            )
                            .limit(1)
                            .get()
                            .get()
                            .getDocuments();

            if (documents.isEmpty()) {
                return Optional.empty();
            }

            Payment payment =
                    documents.get(0)
                            .toObject(Payment.class);

            return Optional.ofNullable(payment);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Failed to find payment by booking ID",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to find payment by booking ID",
                    e
            );
        }
    }

    /**
     * Get all payments.
     */
    public List<Payment> findAll() {

        try {

            List<QueryDocumentSnapshot> documents =
                    firestore
                            .collection(COLLECTION)
                            .get()
                            .get()
                            .getDocuments();

            List<Payment> payments =
                    new ArrayList<>();

            for (QueryDocumentSnapshot document : documents) {

                Payment payment =
                        document.toObject(Payment.class);

                if (payment != null) {
                    payments.add(payment);
                }
            }

            return payments;

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Failed to load payments",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to load payments",
                    e
            );
        }
    }

    /**
     * Delete payment by ID.
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
                    "Failed to delete payment",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to delete payment",
                    e
            );
        }
    }

    /**
     * Generate the next numeric ID.
     *
     * We keep numeric IDs to minimize changes
     * to the existing Reservo application.
     */
    private String generateId() {
        return firestore.collection(COLLECTION).document().getId();
    }
}