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

    public List<Room> checkAvailability(Long resortId, LocalDate checkIn, LocalDate checkOut) {
        List<Room> allRooms = roomRepository.findByResortId(resortId);
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(resortId, checkIn, checkOut);

        Set<Long> occupiedRoomIds = overlappingBookings.stream()
                .map(b -> b.getRoom().getId())
                .collect(Collectors.toSet());

        return allRooms.stream()
                .filter(room -> !occupiedRoomIds.contains(room.getId()) && room.getStatus() == Room.RoomStatus.AVAILABLE)
                .collect(Collectors.toList());
    }
}
