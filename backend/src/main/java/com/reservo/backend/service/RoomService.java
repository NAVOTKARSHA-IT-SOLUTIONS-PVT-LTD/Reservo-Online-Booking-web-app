package com.reservo.backend.service;

import com.reservo.backend.entity.Resort;
import com.reservo.backend.entity.Booking;
import com.reservo.backend.entity.Room;
import com.reservo.backend.entity.User;
import com.reservo.backend.exception.ResourceNotFoundException;
import com.reservo.backend.exception.UnauthorizedException;
import com.reservo.backend.repository.ResortRepository;
import com.reservo.backend.repository.RoomRepository;
import com.reservo.backend.repository.BookingRepository;
import com.reservo.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final ResortRepository resortRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    private void verifyRoomManagementAccess(String resortId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new UnauthorizedException("Authentication required to manage rooms");
        }
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + auth.getName()));

        if (user.getRole() == User.Role.ROLE_ADMIN) {
            return;
        }

        Resort resort = resortRepository.findById(resortId)
                .orElseThrow(() -> new ResourceNotFoundException("Resort not found with ID: " + resortId));

        if (resort.getOwnerId() == null || !resort.getOwnerId().equals(user.getId())) {
            throw new SecurityException("You are not authorized to modify rooms for this property");
        }
    }

    public List<Room> getRoomsByResort(String resortId) {
        Resort resort = resortRepository.findById(resortId)
                .orElseThrow(() -> new ResourceNotFoundException("Resort not found with ID: " + resortId));

        List<Room> rooms = roomRepository.findByResortId(resortId);

        // A published resort must always be bookable. Older/demo properties can
        // exist without a room document, so provision one safe default room on
        // first access. Availability is then open by default for every date
        // until a real booking or an explicit maintenance block exists.
        if (rooms.isEmpty()) {
            Room defaultRoom = Room.builder()
                    .resortId(resortId)
                    .roomNumber("101")
                    .roomType("Standard Room")
                    .description("Default bookable room")
                    .pricePerNight(resort.getPricePerNight() != null
                            ? resort.getPricePerNight() : java.math.BigDecimal.ZERO)
                    .capacity(resort.getGuests() != null && resort.getGuests() > 0
                            ? resort.getGuests() : 2)
                    .bedCount(resort.getBeds() != null && resort.getBeds() > 0
                            ? resort.getBeds() : 1)
                    .bedType("King")
                    .imageUrl(resort.getImageUrl())
                    .status(Room.RoomStatus.AVAILABLE)
                    .cleaningStatus(Room.CleaningStatus.CLEAN)
                    .build();

            rooms = List.of(roomRepository.save(defaultRoom));
        }

        return rooms;
    }

    public Room getRoomById(String id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));
    }

    public Room createRoom(String resortId, Room room) {
        verifyRoomManagementAccess(resortId);

        Resort resort = resortRepository.findById(resortId)
                .orElseThrow(() -> new ResourceNotFoundException("Resort not found with ID: " + resortId));

        // Once a listing is approved, its inventory is locked. Owners must
        // change room inventory through Edit Property, which sends the listing
        // back to PENDING_APPROVAL before the change can be published.
        if (resort.getStatus() == Resort.ResortStatus.APPROVED) {
            throw new IllegalStateException("New rooms cannot be added to a published property. Use Edit Property and submit the property for approval again.");
        }
        room.setResortId(resortId);
        if (room.getStatus() == null) room.setStatus(Room.RoomStatus.AVAILABLE);
        if (room.getCapacity() == null) room.setCapacity(4);
        if (room.getRoomNumber() == null || room.getRoomNumber().isBlank()) {
            int max = roomRepository.findByResortId(resortId).stream().map(Room::getRoomNumber)
                    .filter(java.util.Objects::nonNull).mapToInt(n -> { try { return Integer.parseInt(n.replaceAll("\\D", "")); } catch (Exception e) { return 100; } }).max().orElse(100);
            room.setRoomNumber(String.valueOf(max + 1));
        }
        return roomRepository.save(room);
    }

    public Room updateRoomStatus(String id, Room.RoomStatus status, String maintenance) {
        Room room = getRoomById(id);
        verifyRoomManagementAccess(room.getResortId());
        if (status != null) room.setStatus(status);
        if (maintenance != null) room.setDescription(maintenance);
        return roomRepository.save(room);
    }

    public Room updateRoom(String id, Room updatedDetails) {
        Room room = getRoomById(id);
        verifyRoomManagementAccess(room.getResortId());
        if (updatedDetails.getRoomNumber() != null) room.setRoomNumber(updatedDetails.getRoomNumber());
        if (updatedDetails.getPricePerNight() != null) room.setPricePerNight(updatedDetails.getPricePerNight());
        if (updatedDetails.getCapacity() != null) room.setCapacity(updatedDetails.getCapacity());
        if (updatedDetails.getRoomType() != null) room.setRoomType(updatedDetails.getRoomType());
        if (updatedDetails.getDescription() != null) room.setDescription(updatedDetails.getDescription());
        if (updatedDetails.getBedCount() != null) room.setBedCount(updatedDetails.getBedCount());
        if (updatedDetails.getBedType() != null) room.setBedType(updatedDetails.getBedType());
        if (updatedDetails.getImageUrl() != null) room.setImageUrl(updatedDetails.getImageUrl());
        if (updatedDetails.getStatus() != null) room.setStatus(updatedDetails.getStatus());
        return roomRepository.save(room);
    }

    public void deleteRoom(String id) {
        Room room = getRoomById(id);
        verifyRoomManagementAccess(room.getResortId());

        // Never remove a physical room that is referenced by an active or
        // historical booking. This prevents Edit Property inventory changes
        // from breaking booking history or an existing guest stay.
        boolean hasBooking = bookingRepository.findAll().stream().anyMatch(booking -> {
            if (booking == null || booking.getStatus() == Booking.BookingStatus.CANCELLED) return false;
            if (booking.getAssignedRoomIds() != null
                    && booking.getAssignedRoomIds().stream().anyMatch(roomId ->
                            String.valueOf(room.getId()).equals(String.valueOf(roomId)))) {
                return true;
            }
            return booking.getRoomId() != null
                    && String.valueOf(room.getId()).equals(String.valueOf(booking.getRoomId()));
        });

        if (hasBooking) {
            throw new IllegalStateException(
                    "Room " + (room.getRoomNumber() == null ? "" : room.getRoomNumber())
                            + " cannot be removed because it is linked to a booking."
            );
        }

        roomRepository.deleteById(id);
    }

}
