package com.reservo.backend.entity;

import java.time.Instant;

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
public class LoyaltyTransaction {

    /** Firestore document ID. */
    private String id;

    /** Firestore document ID of the user. */
    private String userId;

    private String description;
    private Integer pointsChange;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
