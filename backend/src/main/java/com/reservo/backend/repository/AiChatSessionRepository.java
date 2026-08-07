package com.reservo.backend.repository;

import com.reservo.backend.entity.AiChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiChatSessionRepository extends JpaRepository<AiChatSession, String> {
    List<AiChatSession> findByUserIdOrderByCreatedAtDesc(Long userId);
}
