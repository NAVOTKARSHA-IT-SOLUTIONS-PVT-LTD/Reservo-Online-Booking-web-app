package com.reservo.backend.repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Repository;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.reservo.backend.entity.Booking;

@Repository
public class BookingRepository {

    private static final String COLLECTION = "bookings";

    private final Firestore firestore;

    public BookingRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    // =========================================================
    // SAVE
    // =========================================================

    public Booking save(Booking booking) {

        try {

            if (booking.getId() == null || booking.getId().isBlank()) {

                booking.setId(
                        firestore
                                .collection(COLLECTION)
                                .document()
                                .getId()
                );
            }

            if (booking.getCreatedAt() == null) {
                booking.setCreatedAt(LocalDate.now()
                        .atStartOfDay()
                        .toInstant(java.time.ZoneOffset.UTC));
            }

            firestore
                    .collection(COLLECTION)
                    .document(booking.getId())
                    .set(booking)
                    .get();

            return booking;

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while saving booking",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to save booking",
                    e
            );
        }
    }

    // =========================================================
    // FIND BY ID
    // =========================================================

    public Optional<Booking> findById(String id) {

        try {

            DocumentSnapshot document =
                    firestore
                            .collection(COLLECTION)
                            .document(id)
                            .get()
                            .get();

            if (!document.exists()) {
                return Optional.empty();
            }

            Booking booking =
                    document.toObject(Booking.class);

            if (booking != null) {
                booking.setId(document.getId());
            }

            return Optional.ofNullable(booking);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while finding booking",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to find booking",
                    e
            );
        }
    }

    // =========================================================
    // FIND BY BOOKING CODE
    // =========================================================

    public Optional<Booking> findByBookingCode(
            String bookingCode
    ) {

        try {

            List<QueryDocumentSnapshot> documents =
                    firestore
                            .collection(COLLECTION)
                            .whereEqualTo(
                                    "bookingCode",
                                    bookingCode
                            )
                            .limit(1)
                            .get()
                            .get()
                            .getDocuments();

            if (documents.isEmpty()) {
                return Optional.empty();
            }

            QueryDocumentSnapshot document =
                    documents.get(0);

            Booking booking =
                    document.toObject(Booking.class);

            if (booking != null) {
                booking.setId(document.getId());
            }

            return Optional.ofNullable(booking);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while finding booking by code",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to find booking by code",
                    e
            );
        }
    }

    // =========================================================
    // FIND BY USER
    // =========================================================

    public List<Booking> findByUserId(String userId) {

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
                    "Interrupted while finding user bookings",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to find user bookings",
                    e
            );
        }
    }

    // =========================================================
    // FIND USER BOOKINGS ORDERED
    // =========================================================

    public List<Booking> findByUserIdOrderByCreatedAtDesc(
            String userId
    ) {

        List<Booking> bookings =
                findByUserId(userId);

        bookings.sort(
                (a, b) -> {

                    if (a.getCreatedAt() == null &&
                            b.getCreatedAt() == null) {
                        return 0;
                    }

                    if (a.getCreatedAt() == null) {
                        return 1;
                    }

                    if (b.getCreatedAt() == null) {
                        return -1;
                    }

                    return b.getCreatedAt()
                            .compareTo(a.getCreatedAt());
                }
        );

        return bookings;
    }

    // =========================================================
    // FIND ALL
    // =========================================================

    public List<Booking> findAll() {

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
                    "Interrupted while loading bookings",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to load bookings",
                    e
            );
        }
    }

    // =========================================================
    // COUNT
    // =========================================================

    public long count() {
        return findAll().size();
    }

    // =========================================================
    // COUNT BY STATUS
    // =========================================================

    public long countByStatus(
            Booking.BookingStatus status
    ) {

        try {

            return firestore
                    .collection(COLLECTION)
                    .whereEqualTo(
                            "status",
                            status.name()
                    )
                    .get()
                    .get()
                    .size();

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while counting bookings",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to count bookings",
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
                    .document(id)
                    .delete()
                    .get();

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Interrupted while deleting booking",
                    e
            );

        } catch (ExecutionException e) {

            throw new RuntimeException(
                    "Failed to delete booking",
                    e
            );
        }
    }

    // =========================================================
    // OVERLAPPING BOOKINGS
    // =========================================================

    public List<Booking> findOverlappingBookings(
            String resortId,
            LocalDate checkInDate,
            LocalDate checkOutDate
    ) {

        List<Booking> bookings =
                findAll();

        return bookings.stream()

                .filter(b ->
                        b.getResortId() != null &&
                        b.getResortId().equals(resortId)
                )

                .filter(b ->
                        b.getStatus() !=
                                Booking.BookingStatus.CANCELLED
                )

                .filter(b ->
                        b.getCheckInDate() != null &&
                        b.getCheckOutDate() != null
                )

                .filter(b ->
                        b.getCheckInDate()
                                .isBefore(checkOutDate)
                                &&
                        b.getCheckOutDate()
                                .isAfter(checkInDate)
                )

                .toList();
    }

    // =========================================================
    // TOTAL REVENUE
    // =========================================================

    public java.math.BigDecimal calculateTotalRevenue() {

        return findAll()
                .stream()
                .filter(b ->
                        b.getStatus() ==
                                Booking.BookingStatus.CONFIRMED
                        ||
                        b.getStatus() ==
                                Booking.BookingStatus.COMPLETED
                )
                .map(Booking::getTotalAmount)
                .filter(java.util.Objects::nonNull)
                .reduce(
                        java.math.BigDecimal.ZERO,
                        java.math.BigDecimal::add
                );
    }

    // =========================================================
    // BOOKINGS BY SOURCE
    // =========================================================

    public java.util.Map<String, Long> countBookingsBySource() {

        return findAll()
                .stream()
                .filter(b -> b.getBookingSource() != null)
                .collect(
                        java.util.stream.Collectors.groupingBy(
                                b -> b.getBookingSource().name(),
                                java.util.stream.Collectors.counting()
                        )
                );
    }

    // =========================================================
    // CONVERT DOCUMENTS
    // =========================================================

    private List<Booking> convertDocuments(
            List<QueryDocumentSnapshot> documents
    ) {

        List<Booking> bookings =
                new ArrayList<>();

        for (QueryDocumentSnapshot document :
                documents) {

            Booking booking =
                    document.toObject(Booking.class);

            if (booking != null) {

                booking.setId(
                        document.getId()
                );

                bookings.add(booking);
            }
        }

        return bookings;
    }
}