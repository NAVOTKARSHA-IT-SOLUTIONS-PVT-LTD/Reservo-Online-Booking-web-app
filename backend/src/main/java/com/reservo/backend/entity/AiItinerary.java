package com.reservo.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "ai_itineraries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiItinerary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Optional registered user ID

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private Integer durationDays;

    @Column(nullable = false)
    private String budgetLevel; // "budget", "moderate", "luxury"

    @Column(columnDefinition = "TEXT", nullable = false)
    private String itineraryJson; // Structured daily timeline blocks

    @Builder.Default
    private Instant createdAt = Instant.now();
}
