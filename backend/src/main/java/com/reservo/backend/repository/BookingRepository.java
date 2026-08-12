package com.reservo.backend.repository;

import com.reservo.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingCode(String bookingCode);

    List<Booking> findByUserId(Long userId);

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByStatus(Booking.BookingStatus status);

    @Query("""
            SELECT SUM(b.totalAmount)
            FROM Booking b
            WHERE b.status = 'CONFIRMED'
               OR b.status = 'COMPLETED'
            """)
    BigDecimal calculateTotalRevenue();

    @Query("""
            SELECT b.bookingSource, COUNT(b)
            FROM Booking b
            GROUP BY b.bookingSource
            """)
    List<Object[]> countBookingsBySource();

    @Query("""
            SELECT b
            FROM Booking b
            WHERE b.resort.id = :resortId
            AND b.status <> 'CANCELLED'
            AND b.checkInDate < :checkOutDate
            AND b.checkOutDate > :checkInDate
            """)
    List<Booking> findOverlappingBookings(
            Long resortId,
            LocalDate checkInDate,
            LocalDate checkOutDate
    );
}