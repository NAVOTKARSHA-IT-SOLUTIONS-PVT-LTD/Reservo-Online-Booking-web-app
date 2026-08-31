package com.reservo.backend.entity;

import java.time.Instant;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Offer {

    /** Firestore document ID. */
    private String id;

    private String code;
    private String type;
    private String discount;
    private String status;
    private LocalDate expiryDate;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
