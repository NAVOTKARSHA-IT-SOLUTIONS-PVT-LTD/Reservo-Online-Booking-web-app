package com.reservo.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String roomNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomType type;

    @Column(nullable = false)
    private BigDecimal pricePerNight;

    @Builder.Default
    private Integer capacity = 2;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomStatus status;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CleaningStatus cleaningStatus = CleaningStatus.CLEAN;

    private String maintenanceDetails;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resort_id", nullable = false)
    private Resort resort;

    @Builder.Default
    private Instant createdAt = Instant.now();

    public enum RoomType {
        SINGLE, DOUBLE, SUITE, DELUXE, VILLA_WITH_POOL, DELUXE_SEA_VIEW
    }

    public enum RoomStatus {
        AVAILABLE, OCCUPIED, MAINTENANCE, BLOCKED
    }

    public enum CleaningStatus {
        CLEAN, DIRTY, CLEANING
    }
}
