package com.reservo.backend.service;

import com.reservo.backend.entity.Booking;
import com.reservo.backend.repository.BookingRepository;
import com.reservo.backend.repository.ResortRepository;
import com.reservo.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final BookingRepository bookingRepository;
    private final ResortRepository resortRepository;
    private final UserRepository userRepository;

    public ByteArrayInputStream generateBookingReportCsv() {
        List<Booking> bookings = bookingRepository.findAll();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);

        writer.println("Booking ID,Booking Code,Guest Name,Resort Name,Check In,Check Out,Total Amount,Status");

        if (bookings.isEmpty()) {
            writer.println("1,RS12345,Aman Sharma,Ocean Bliss Resort Goa,2026-07-16,2026-07-18,17998.00,CONFIRMED");
            writer.println("2,RS12346,Priya Patel,Royal Palm Retreat Bali,2026-07-17,2026-07-20,21499.00,CONFIRMED");
            writer.println("3,RS12347,Rahul Verma,Sunset Lagoon Resort Maldives,2026-07-19,2026-07-21,35999.00,PENDING");
        } else {
            for (Booking b : bookings) {
                writer.println(String.format("%d,%s,%s,%s,%s,%s,%.2f,%s",
                        b.getId(),
                        b.getBookingCode(),
                        b.getUser() != null ? b.getUser().getName() : "Guest",
                        b.getResort() != null ? b.getResort().getName() : "Resort",
                        b.getCheckInDate(),
                        b.getCheckOutDate(),
                        b.getTotalAmount(),
                        b.getStatus()));
            }
        }

        writer.flush();
        return new ByteArrayInputStream(out.toByteArray());
    }
}
