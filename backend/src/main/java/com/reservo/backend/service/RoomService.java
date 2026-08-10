package com.reservo.backend.service;

import com.reservo.backend.entity.Room;
import com.reservo.backend.entity.Resort;
import com.reservo.backend.exception.ResourceNotFoundException;
import com.reservo.backend.repository.RoomRepository;
import com.reservo.backend.repository.ResortRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final ResortRepository resortRepository;

    public List<Room> getRoomsByResort(Long resortId) {
        return roomRepository.findByResortId(resortId);
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));
    }

    @Transactional
    public Room createRoom(Long resortId, Room room) {
        Resort resort = resortRepository.findById(resortId)
                .orElseThrow(() -> new ResourceNotFoundException("Resort not found with ID: " + resortId));
        room.setResort(resort);
        if (room.getStatus() == null) {
            room.setStatus(Room.RoomStatus.AVAILABLE);
        }
        return roomRepository.save(room);
    }

    @Transactional
    public Room updateRoomStatus(Long id, Room.RoomStatus status, Room.CleaningStatus cleaningStatus, String maintenance) {
        Room room = getRoomById(id);
        if (status != null) room.setStatus(status);
        if (cleaningStatus != null) room.setCleaningStatus(cleaningStatus);
        if (maintenance != null) room.setMaintenanceDetails(maintenance);
        return roomRepository.save(room);
    }
}
