package com.reservo.backend.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiChatSession {

    /** Firestore document ID. */
    private String id;

    /** Firestore document ID of the user. */
    private String userId;

    /** Examples: luxury, budget, adventure, relax. */
    private String mood;

    @Builder.Default
    private Instant createdAt = Instant.now();

    /**
     * Messages are stored in the separate ai_chat_messages collection.
     * Repositories/services can populate this list when returning a complete session.
     */
    @Builder.Default
    @ToString.Exclude
    private List<AiChatMessage> messages = new ArrayList<>();
}
