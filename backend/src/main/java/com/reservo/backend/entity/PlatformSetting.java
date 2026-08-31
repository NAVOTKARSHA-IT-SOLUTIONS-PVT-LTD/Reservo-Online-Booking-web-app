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
public class PlatformSetting {

    /** Firestore document ID. */
    private String id;

    private String settingKey;
    private String settingValue;
    private String description;
    private String updatedBy;

    @Builder.Default
    private Instant updatedAt = Instant.now();
}
