package com.reservo.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "admin_audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String adminUsername;

    @Column(nullable = false)
    private String action;

    private String targetEntity;

    private String targetId;

    @Column(columnDefinition = "TEXT")
    private String details;

    private String ipAddress;

    @Builder.Default
    private Instant timestamp = Instant.now();
}
