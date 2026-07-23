package com.reservo.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reservo.backend.dto.BookingRequest;
import com.reservo.backend.dto.BookingResponse;
import com.reservo.backend.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")

public class BookingController {
     @Autowired
    private BookingService bookingService;

    // Create Booking
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest request) {

        BookingResponse response = bookingService.createBooking(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Get All Bookings
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {

        List<BookingResponse> bookings = bookingService.getAllBookings();

        return ResponseEntity.ok(bookings);
    }

    // Get Booking By ID
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {

        BookingResponse booking = bookingService.getBookingById(id);

        return ResponseEntity.ok(booking);
    }

    // Update Booking
    @PutMapping("/{id}")
    public ResponseEntity<BookingResponse> updateBooking(
            @PathVariable Long id,
            @RequestBody BookingRequest request) {

        BookingResponse updatedBooking = bookingService.updateBooking(id, request);

        return ResponseEntity.ok(updatedBooking);
    }

    // Cancel Booking
    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelBooking(@PathVariable Long id) {

        bookingService.cancelBooking(id);

        return ResponseEntity.ok("Booking cancelled successfully.");
    }
}
