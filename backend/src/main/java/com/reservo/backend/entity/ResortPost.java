package com.reservo.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "resort_posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResortPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long resortId;

    private String type; // e.g. "image", "video", "event"

    private String mediaUrl;

    @Column(columnDefinition = "TEXT")
    private String caption;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
