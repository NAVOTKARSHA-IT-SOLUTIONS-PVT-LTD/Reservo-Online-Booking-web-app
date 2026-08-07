package com.reservo.backend.repository;

import com.reservo.backend.entity.AiItinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AiItineraryRepository extends JpaRepository<AiItinerary, Long> {
    Optional<AiItinerary> findFirstByDestinationIgnoreCaseAndDurationDaysAndBudgetLevelIgnoreCase(
            String destination, Integer durationDays, String budgetLevel);
}
