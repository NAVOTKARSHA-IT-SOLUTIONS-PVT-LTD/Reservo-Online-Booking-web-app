package com.reservo.backend.service;

import com.reservo.backend.dto.BookingRequest;
import com.reservo.backend.dto.BookingResponse;
import com.reservo.backend.entity.Booking;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BookingService {
     private final List<Booking> bookings = new ArrayList<>();
    private Long bookingIdCounter = 1L;

    // Create Booking
    public BookingResponse createBooking(BookingRequest request) {

        Booking booking = new Booking();

        booking.setBookingId(bookingIdCounter++);
        booking.setResortId(request.getResortId());
        booking.setUserId(request.getUserId());
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setGuests(request.getGuests());

        // Dummy price calculation
        booking.setTotalPrice(request.getGuests() * 2000);

        booking.setStatus("CONFIRMED");

        bookings.add(booking);

        return convertToResponse(booking);
    }

    // Get All Bookings
    public List<BookingResponse> getAllBookings() {

        List<BookingResponse> responseList = new ArrayList<>();

        for (Booking booking : bookings) {
            responseList.add(convertToResponse(booking));
        }

        return responseList;
    }

    // Get Booking By ID
    public BookingResponse getBookingById(Long bookingId) {

        for (Booking booking : bookings) {

            if (booking.getBookingId().equals(bookingId)) {
                return convertToResponse(booking);
            }
        }

        throw new RuntimeException("Booking not found with ID: " + bookingId);
    }

    // Update Booking
    public BookingResponse updateBooking(Long bookingId, BookingRequest request) {

        for (Booking booking : bookings) {

            if (booking.getBookingId().equals(bookingId)) {

                booking.setResortId(request.getResortId());
                booking.setUserId(request.getUserId());
                booking.setCheckIn(request.getCheckIn());
                booking.setCheckOut(request.getCheckOut());
                booking.setGuests(request.getGuests());

                booking.setTotalPrice(request.getGuests() * 2000);

                return convertToResponse(booking);
            }
        }

        throw new RuntimeException("Booking not found with ID: " + bookingId);
    }

    // Cancel Booking
    public void cancelBooking(Long bookingId) {

        for (Booking booking : bookings) {

            if (booking.getBookingId().equals(bookingId)) {

                booking.setStatus("CANCELLED");
                return;
            }
        }

        throw new RuntimeException("Booking not found with ID: " + bookingId);
    }

    // Convert Booking Entity to BookingResponse DTO
    private BookingResponse convertToResponse(Booking booking) {

        BookingResponse response = new BookingResponse();

        response.setBookingId(booking.getBookingId());
        response.setResortId(booking.getResortId());
        response.setUserId(booking.getUserId());
        response.setCheckIn(booking.getCheckIn());
        response.setCheckOut(booking.getCheckOut());
        response.setGuests(booking.getGuests());
        response.setTotalPrice(booking.getTotalPrice());
        response.setStatus(booking.getStatus());

        return response;
    }

}
