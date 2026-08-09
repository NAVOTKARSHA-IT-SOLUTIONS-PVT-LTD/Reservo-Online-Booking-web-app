package com.reservo.backend.repository;

import com.reservo.backend.entity.ResortPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResortPostRepository extends JpaRepository<ResortPost, Long> {
    List<ResortPost> findByResortIdOrderByCreatedAtDesc(Long resortId);
}
