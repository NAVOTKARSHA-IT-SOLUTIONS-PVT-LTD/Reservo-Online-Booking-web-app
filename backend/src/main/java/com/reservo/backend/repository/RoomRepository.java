package com.reservo.backend.repository;

import com.reservo.backend.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByResortId(Long resortId);
    long countByStatus(Room.RoomStatus status);
}
