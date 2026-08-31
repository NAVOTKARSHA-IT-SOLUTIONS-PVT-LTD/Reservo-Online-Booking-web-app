package com.reservo.backend.service;

import com.reservo.backend.entity.Booking;
import com.reservo.backend.entity.Room;
import com.reservo.backend.repository.BookingRepository;
import com.reservo.backend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvailabilityService {
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    public List<Room> checkAvailability(String resortId, LocalDate checkIn, LocalDate checkOut) {
        List<Room> allRooms = roomRepository.findByResortId(resortId);
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(resortId, checkIn, checkOut);

        Set<String> occupiedRoomIds = overlapping.stream()
                .map(Booking::getRoomId)
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toSet());

        return allRooms.stream()
                .filter(r -> !occupiedRoomIds.contains(r.getId()))
                .filter(r -> r.getStatus() == Room.RoomStatus.AVAILABLE)
                .toList();
    }
}
