package com.reservo.backend.controller;

import com.reservo.backend.dto.ApiResponse;
import com.reservo.backend.entity.Room;
import com.reservo.backend.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping("/resort/{resortId}")
    public ResponseEntity<ApiResponse<List<Room>>> getRoomsByResort(@PathVariable Long resortId) {
        return ResponseEntity.ok(ApiResponse.success(roomService.getRoomsByResort(resortId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Room>> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(roomService.getRoomById(id)));
    }

    @PostMapping("/resort/{resortId}")
    public ResponseEntity<ApiResponse<Room>> createRoom(@PathVariable Long resortId, @RequestBody Room room) {
        Room created = roomService.createRoom(resortId, room);
        return ResponseEntity.ok(ApiResponse.success(created, "Room created successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Room>> updateRoomStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Room.RoomStatus status = body.get("status") != null ? Room.RoomStatus.valueOf(body.get("status").toUpperCase()) : null;
        Room.CleaningStatus cleaning = body.get("cleaningStatus") != null ? Room.CleaningStatus.valueOf(body.get("cleaningStatus").toUpperCase()) : null;
        String maintenance = body.get("maintenanceDetails");
        Room updated = roomService.updateRoomStatus(id, status, cleaning, maintenance);
        return ResponseEntity.ok(ApiResponse.success(updated, "Room status updated successfully"));
    }
}
