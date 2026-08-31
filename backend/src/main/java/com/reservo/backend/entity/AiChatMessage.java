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
public class AiChatMessage {

    /** Firestore document ID. */
    private String id;

    /** Firestore document ID of the parent chat session. */
    private String sessionId;

    /** Message sender: user or rivo. */
    private String sender;

    private String messageText;

    /** Optional Firestore document ID of a recommended resort. */
    private String recommendedResortId;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
