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
public class Review {

    /** Firestore document ID. */
    private String id;

    private Double rating;
    private String comment;

    /** Firestore document ID of the user. */
    private String userId;

    /** Firestore document ID of the resort. */
    private String resortId;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
