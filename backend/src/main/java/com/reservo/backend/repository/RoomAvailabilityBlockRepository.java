package com.reservo.backend.repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.google.cloud.firestore.Firestore;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class RoomAvailabilityBlockRepository {
    private static final String COLLECTION = "room_availability_blocks";
    private final Firestore firestore;

    private String id(String roomId, LocalDate date) { return String.valueOf(roomId) + "_" + date; }

    public void block(String roomId, LocalDate date) {
        try {
            firestore.collection(COLLECTION).document(id(roomId, date))
                    .set(java.util.Map.of("roomId", roomId, "date", date.toString(), "blocked", true)).get();
        } catch (InterruptedException e) { Thread.currentThread().interrupt(); throw new RuntimeException("Interrupted while blocking room date", e); }
        catch (Exception e) { throw new RuntimeException("Failed to block room date", e); }
    }

    public void unblock(String roomId, LocalDate date) {
        try { firestore.collection(COLLECTION).document(id(roomId, date)).delete().get(); }
        catch (InterruptedException e) { Thread.currentThread().interrupt(); throw new RuntimeException("Interrupted while unblocking room date", e); }
        catch (Exception e) { throw new RuntimeException("Failed to unblock room date", e); }
    }

    public boolean isBlocked(String roomId, LocalDate date) {
        try { return firestore.collection(COLLECTION).document(id(roomId, date)).get().get().exists(); }
        catch (InterruptedException e) { Thread.currentThread().interrupt(); throw new RuntimeException("Interrupted while checking room date", e); }
        catch (Exception e) { throw new RuntimeException("Failed to check room date", e); }
    }

    public List<String> findBlockedDates(String roomId, LocalDate from, LocalDate to) {
        List<String> result = new ArrayList<>();
        if (from == null || to == null || !from.isBefore(to)) return result;
        for (LocalDate d=from; d.isBefore(to); d=d.plusDays(1)) if (isBlocked(roomId,d)) result.add(d.toString());
        return result;
    }
}
