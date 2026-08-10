package com.reservo.backend.controller;

import com.reservo.backend.dto.ApiResponse;
import com.reservo.backend.entity.Booking;
import com.reservo.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Booking>> createBooking(
            @RequestParam Long userId,
            @RequestParam Long resortId,
            @RequestParam Long roomId,
            @RequestParam String checkIn,
            @RequestParam String checkOut,
            @RequestParam BigDecimal amount) {
        Booking booking = bookingService.createBooking(
                userId, resortId, roomId,
                LocalDate.parse(checkIn), LocalDate.parse(checkOut),
                amount);
        return ResponseEntity.ok(ApiResponse.success(booking, "Booking created and confirmed successfully"));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<Booking>>> getUserBookings(@RequestParam Long userId) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getUserBookings(userId)));
    }
}
