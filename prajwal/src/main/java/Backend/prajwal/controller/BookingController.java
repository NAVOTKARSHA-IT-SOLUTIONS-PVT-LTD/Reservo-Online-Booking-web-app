package Backend.prajwal.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Backend.prajwal.dto.BookingRequest;
import Backend.prajwal.dto.BookingResponse;
import Backend.prajwal.entity.BookingStatus;
import Backend.prajwal.entity.PaymentStatus;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    // 1. Create Booking
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest request) {

        BookingResponse response = new BookingResponse();

        response.setBookingId(101L);
        response.setRoomName("Deluxe Room");
        response.setCheckIn(request.getCheckIn());
        response.setCheckOut(request.getCheckOut());
        response.setTotalPrice(6000.0);
        response.setBookingStatus(BookingStatus.CONFIRMED);
        response.setPaymentStatus(PaymentStatus.UNPAID);

        return ResponseEntity.ok(response);
    }

    // 2. Get Booking By Id
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable Long id) {

        BookingResponse response = new BookingResponse();

        response.setBookingId(id);
        response.setRoomName("Luxury Suite");
        response.setCheckIn(LocalDate.of(2026, 8, 10));
        response.setCheckOut(LocalDate.of(2026, 8, 12));
        response.setTotalPrice(10000.0);
        response.setBookingStatus(BookingStatus.CONFIRMED);
        response.setPaymentStatus(PaymentStatus.PAID);

        return ResponseEntity.ok(response);
    }

    // 3. Get All Bookings
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {

        List<BookingResponse> bookings = new ArrayList<>();

        BookingResponse booking1 = new BookingResponse();
        booking1.setBookingId(1L);
        booking1.setRoomName("Deluxe Room");
        booking1.setCheckIn(LocalDate.of(2026, 8, 1));
        booking1.setCheckOut(LocalDate.of(2026, 8, 3));
        booking1.setTotalPrice(6000.0);
        booking1.setBookingStatus(BookingStatus.CONFIRMED);
        booking1.setPaymentStatus(PaymentStatus.PAID);

        BookingResponse booking2 = new BookingResponse();
        booking2.setBookingId(2L);
        booking2.setRoomName("Luxury Suite");
        booking2.setCheckIn(LocalDate.of(2026, 8, 10));
        booking2.setCheckOut(LocalDate.of(2026, 8, 12));
        booking2.setTotalPrice(12000.0);
        booking2.setBookingStatus(BookingStatus.PENDING);
        booking2.setPaymentStatus(PaymentStatus.UNPAID);

        bookings.add(booking1);
        bookings.add(booking2);

        return ResponseEntity.ok(bookings);
    }

    // 4. Update Booking
    @PutMapping("/{id}")
    public ResponseEntity<String> updateBooking(
            @PathVariable Long id,
            @RequestBody BookingRequest request) {

        return ResponseEntity.ok(
                "Booking with ID " + id + " updated successfully.");
    }

    // 5. Cancel Booking
    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelBooking(@PathVariable Long id) {

        return ResponseEntity.ok(
                "Booking with ID " + id + " cancelled successfully.");
    }
}