package com.reservo.backend.repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.google.cloud.firestore.Firestore;

import lombok.RequiredArgsConstructor;

/**
 * Stores property-level availability blocks. A property-level block makes
 * every room in the property unavailable for the affected night.
 */
@Repository
@RequiredArgsConstructor
public class AvailabilityBlockRepository {

    private static final String COLLECTION = "availability_blocks";

    private final Firestore firestore;

    private String id(String resortId, LocalDate date) {
        return String.valueOf(resortId) + "_" + date;
    }

    public void block(String resortId, LocalDate date) {
        if (resortId == null || date == null) {
            throw new IllegalArgumentException("Resort ID and date are required");
        }
        try {
            firestore.collection(COLLECTION)
                    .document(id(resortId, date))
                    .set(java.util.Map.of(
                            "resortId", resortId,
                            "date", date.toString(),
                            "blocked", true))
                    .get();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted while blocking property date", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to block property date", e);
        }
    }

    public void unblock(String resortId, LocalDate date) {
        if (resortId == null || date == null) {
            throw new IllegalArgumentException("Resort ID and date are required");
        }
        try {
            firestore.collection(COLLECTION)
                    .document(id(resortId, date))
                    .delete()
                    .get();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted while unblocking property date", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to unblock property date", e);
        }
    }

    public boolean isBlocked(String resortId, LocalDate date) {
        if (resortId == null || date == null) {
            return false;
        }
        try {
            return firestore.collection(COLLECTION)
                    .document(id(resortId, date))
                    .get()
                    .get()
                    .exists();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted while checking property date", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to check property date", e);
        }
    }

    public List<String> findBlockedDates(String resortId, LocalDate from, LocalDate to) {
        List<String> result = new ArrayList<>();
        if (resortId == null || from == null || to == null || !from.isBefore(to)) {
            return result;
        }
        for (LocalDate date = from; date.isBefore(to); date = date.plusDays(1)) {
            if (isBlocked(resortId, date)) {
                result.add(date.toString());
            }
        }
        return result;
    }
}
