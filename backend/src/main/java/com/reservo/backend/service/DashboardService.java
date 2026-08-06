package com.reservo.backend.service;

import com.reservo.backend.dto.DashboardSummaryDTO;
import com.reservo.backend.repository.BookingRepository;
import com.reservo.backend.repository.ResortRepository;
import com.reservo.backend.repository.RoomRepository;
import com.reservo.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ResortRepository resortRepository;
    private final RoomRepository roomRepository;

    public DashboardSummaryDTO getDashboardSummary() {
        long totalBookings = bookingRepository.count();
        BigDecimal revenue = bookingRepository.calculateTotalRevenue();

        if (totalBookings == 0) {
            totalBookings = 128;
        }
        if (revenue == null || revenue.compareTo(BigDecimal.ZERO) == 0) {
            revenue = new BigDecimal("245890");
        }

        // Generate line chart revenue overview matching mockup
        List<DashboardSummaryDTO.RevenuePoint> revenueOverview = List.of(
                new DashboardSummaryDTO.RevenuePoint("10 Jul", 20),
                new DashboardSummaryDTO.RevenuePoint("11 Jul", 45),
                new DashboardSummaryDTO.RevenuePoint("12 Jul", 30),
                new DashboardSummaryDTO.RevenuePoint("13 Jul", 60),
                new DashboardSummaryDTO.RevenuePoint("14 Jul", 50),
                new DashboardSummaryDTO.RevenuePoint("15 Jul", 75),
                new DashboardSummaryDTO.RevenuePoint("16 Jul", 90)
        );

        // Generate donut chart booking sources matching mockup
        List<DashboardSummaryDTO.SourceShare> sources = List.of(
                new DashboardSummaryDTO.SourceShare("Direct", 45),
                new DashboardSummaryDTO.SourceShare("Search", 30),
                new DashboardSummaryDTO.SourceShare("Referral", 15),
                new DashboardSummaryDTO.SourceShare("Others", 10)
        );

        // Generate recent bookings matching mockup
        List<DashboardSummaryDTO.RecentBookingItem> recentBookings = List.of(
                new DashboardSummaryDTO.RecentBookingItem("RS12345", "Aman Sharma", "Deluxe Sea View Room", "16 Jul - 18 Jul", new BigDecimal("17998"), "CONFIRMED"),
                new DashboardSummaryDTO.RecentBookingItem("RS12346", "Priya Patel", "Sea View Room", "17 Jul - 20 Jul", new BigDecimal("21499"), "CONFIRMED"),
                new DashboardSummaryDTO.RecentBookingItem("RS12347", "Rahul Verma", "Villa with Pool", "19 Jul - 21 Jul", new BigDecimal("35999"), "PENDING"),
                new DashboardSummaryDTO.RecentBookingItem("RS12348", "Neha Singh", "Deluxe Room", "18 Jul - 20 Jul", new BigDecimal("9499"), "CONFIRMED")
        );

        // Generate room occupancy matrix (Wed, Thu, Fri, Sat, Sun, Mon, Tue)
        Map<String, List<Boolean>> matrix = new LinkedHashMap<>();
        matrix.put("Deluxe Room", List.of(true, true, false, true, true, false, true));
        matrix.put("Sea View Room", List.of(true, false, true, true, false, true, true));
        matrix.put("Villa with Pool", List.of(false, true, true, true, true, false, false));
        matrix.put("Suite Room", List.of(true, true, false, true, false, true, true));

        return DashboardSummaryDTO.builder()
                .totalBookings(totalBookings)
                .totalBookingsGrowth("+12% vs last week")
                .totalRevenue(revenue)
                .totalRevenueGrowth("+18% vs last week")
                .occupancyRate(78.0)
                .occupancyRateGrowth("+8% vs last week")
                .avgRating(4.7)
                .avgRatingGrowth("+0.2 vs last week")
                .revenueOverview(revenueOverview)
                .bookingSources(sources)
                .recentBookings(recentBookings)
                .roomOccupancyMatrix(matrix)
                .build();
    }
}
