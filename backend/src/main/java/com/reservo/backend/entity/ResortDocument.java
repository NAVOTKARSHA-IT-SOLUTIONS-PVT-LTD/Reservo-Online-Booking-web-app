package com.reservo.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "resort_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResortDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // e.g. "GST Certificate", "PAN Card Registration", "Resort License"

    @Column(nullable = false)
    private String status; // e.g. "Verified", "Verification Pending", "Expired"

    private LocalDate expiryDate;

    private String documentUrl; // URL or path of the uploaded file

    private String fileSize; // Formatted size of the file

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resort_id", nullable = false)
    private Resort resort;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
