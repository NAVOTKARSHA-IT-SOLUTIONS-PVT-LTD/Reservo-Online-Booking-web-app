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
public class ResortDocument {

    /** Firestore document ID. */
    private String id;

    private String name;
    private String status;
    private LocalDate expiryDate;
    private String documentUrl;
    private String fileSize;

    /** Firestore document ID of the related resort. */
    private String resortId;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
