package com.reservo.backend.repository;

import com.reservo.backend.entity.Resort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResortRepository extends JpaRepository<Resort, Long> {
    List<Resort> findByStatus(Resort.ResortStatus status);
    List<Resort> findByLocationContainingIgnoreCase(String location);
    long countByStatus(Resort.ResortStatus status);
}
