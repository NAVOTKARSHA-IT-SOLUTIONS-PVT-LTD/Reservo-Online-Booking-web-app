package com.reservo.backend.repository;

import com.reservo.backend.entity.ResortDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResortDocumentRepository extends JpaRepository<ResortDocument, Long> {
    List<ResortDocument> findByResortId(Long resortId);
}
