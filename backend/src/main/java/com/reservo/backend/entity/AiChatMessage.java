package com.reservo.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "ai_chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    @ToString.Exclude
    private AiChatSession session;

    @Column(nullable = false)
    private String sender; // "user" or "rivo"

    @Column(columnDefinition = "TEXT", nullable = false)
    private String messageText;

    private Long recommendedResortId; // Optional link to specific seeded Resort ID

    @Builder.Default
    private Instant createdAt = Instant.now();
}
