package com.reservo.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ai_chat_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiChatSession {

    @Id
    private String id; // UUID or custom token

    private Long userId;

    private String mood; // e.g. "luxury", "budget", "adventure", "relax"

    @Builder.Default
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    @ToString.Exclude
    private List<AiChatMessage> messages = new ArrayList<>();
}
