package com.reservo.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    // Security Requirement: Store Argon2id hash, never plain-text password
    // Column length increased to accommodate Argon2id hash format
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    private String avatarUrl;

    @Column(name = "reward_points", nullable = false)
    @Builder.Default
    private Integer rewardPoints = 24500;

    @Column(name = "membership_level", nullable = false)
    @Builder.Default
    private String membershipLevel = "Gold Member";

    // Security Requirement: User Authentication fields
    @Column(name = "login_provider", length = 50)
    @Builder.Default
    private String loginProvider = "LOCAL"; // LOCAL, GOOGLE, FACEBOOK, etc.

    @Column(name = "provider_user_id", length = 255)
    private String providerUserId; // OAuth2 provider user ID

    @Column(name = "email_verified", nullable = false)
    @Builder.Default
    private boolean emailVerified = false;

    @Column(name = "phone_verified", nullable = false)
    @Builder.Default
    private boolean phoneVerified = false;

    @Column(name = "account_locked", nullable = false)
    @Builder.Default
    private boolean accountLocked = false;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private Instant updatedAt = Instant.now();

    // JPA lifecycle callback to update timestamp
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public enum Role {
        ROLE_ADMIN, ROLE_OWNER, ROLE_CUSTOMER
    }

    public enum UserStatus {
        ACTIVE, INACTIVE, BLOCKED
    }
}