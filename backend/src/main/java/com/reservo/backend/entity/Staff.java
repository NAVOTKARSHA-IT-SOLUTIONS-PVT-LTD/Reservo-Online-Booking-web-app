package com.reservo.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "staff_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String role; // e.g. "Owner", "Manager", "Reception", "Housekeeping", "Finance"

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String status; // e.g. "Active", "Inactive"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resort_id")
    private Resort resort;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
