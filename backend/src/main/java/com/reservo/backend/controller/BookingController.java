package com.reservo.backend.controller;

import com.reservo.backend.dto.ApiResponse;
import com.reservo.backend.dto.BookingHistoryResponse;
import com.reservo.backend.entity.Booking;
import com.reservo.backend.entity.User;
import com.reservo.backend.exception.UnauthorizedException;
import com.reservo.backend.service.AuthService;
import com.reservo.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final AuthService authService;

    private String resolveEffectiveUserId(String requestedUserId) {
        Optional<User> authUser = authService.getOptionalAuthenticatedUser();
        if (authUser.isPresent()) {
            User user = authUser.get();
            if (user.getRole() == User.Role.ROLE_ADMIN) {
                return (requestedUserId != null && !requestedUserId.isBlank()) ? requestedUserId : user.getId();
            }
            return user.getId();
        }
        if (requestedUserId != null && !requestedUserId.isBlank()) {
            return requestedUserId;
        }
        throw new UnauthorizedException("Authentication required to perform booking operations");
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Booking>> createBooking(
            @RequestParam(required = false) String userId,
            @RequestParam String resortId,
            @RequestParam String roomId,
            @RequestParam String checkIn,
            @RequestParam String checkOut,
            @RequestParam BigDecimal amount) {
        String effectiveUserId = resolveEffectiveUserId(userId);
        Booking booking = bookingService.createBooking(
                effectiveUserId, resortId, roomId,
                LocalDate.parse(checkIn), LocalDate.parse(checkOut),
                amount, null, null, null, BigDecimal.ZERO, 0, BigDecimal.ZERO);
        // Standard direct booking confirms instantly for backwards-compatibility
        bookingService.confirmBooking(booking.getBookingCode(), "ch_direct_" + System.currentTimeMillis(), "DIRECT");
        return ResponseEntity.ok(ApiResponse.success(booking, "Booking created and confirmed successfully"));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<Booking>>> getUserBookings(@RequestParam(required = false) String userId) {
        String effectiveUserId = resolveEffectiveUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(bookingService.getUserBookings(effectiveUserId)));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<BookingHistoryResponse>>> getBookingHistory(
            @RequestParam(required = false) String userId
    ) {
        String effectiveUserId = resolveEffectiveUserId(userId);
        return ResponseEntity.ok(
                ApiResponse.success(
                        bookingService.getUserBookingHistory(effectiveUserId),
                        "Booking history retrieved successfully"
                )
        );
    }

    @GetMapping("/admin-all")
    public ResponseEntity<ApiResponse<List<Booking>>> getAdminAllBookings() {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getAllBookings()));
    }

    @PostMapping("/update-status")
    public ResponseEntity<ApiResponse<Booking>> updateBookingStatus(
            @RequestParam String bookingId,
            @RequestParam Booking.BookingStatus status) {
        Booking updated = bookingService.updateBookingStatus(bookingId, status);
        return ResponseEntity.ok(ApiResponse.success(updated, "Booking status updated successfully"));
    }
}
