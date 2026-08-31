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
public class ResortPost {

    /** Firestore document ID. */
    private String id;

    /** Firestore document ID of the resort. */
    private String resortId;

    private String type;
    private String mediaUrl;
    private String caption;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
