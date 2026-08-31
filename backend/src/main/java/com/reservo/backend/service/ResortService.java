package com.reservo.backend.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.reservo.backend.entity.Resort;
import com.reservo.backend.entity.User;
import com.reservo.backend.exception.ResourceNotFoundException;
import com.reservo.backend.repository.ResortRepository;
import com.reservo.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResortService {

    private final ResortRepository resortRepository;
    private final UserRepository userRepository;

    // ============================================================
    // GET ALL APPROVED RESORTS
    // ============================================================

    public List<Resort> getAllApprovedResorts() {
        return resortRepository.findByStatus(
                Resort.ResortStatus.APPROVED
        );
    }

    // ============================================================
    // GET ALL RESORTS - ADMIN
    // ============================================================

    public List<Resort> getAllResortsForAdmin() {
        return resortRepository.findAll();
    }

    // ============================================================
    // UPDATE RESORT STATUS
    // ============================================================

    public Resort updateResortStatus(
            String resortId,
            Resort.ResortStatus status
    ) {

        Resort resort = getResortById(resortId);

        resort.setStatus(status);

        return resortRepository.save(resort);
    }

    // ============================================================
    // REQUEST CHANGES
    // ============================================================

    public Resort requestChanges(
            String resortId,
            String comment
    ) {

        Resort resort = getResortById(resortId);

        resort.setStatus(
                Resort.ResortStatus.CHANGES_REQUESTED
        );

        if (comment != null && !comment.isBlank()) {
            resort.setFeaturedTag(
                    "Action Required: " + comment
            );
        }

        return resortRepository.save(resort);
    }

    // ============================================================
    // GET RESORT BY ID
    // ============================================================

    public Resort getResortById(String id) {

        return resortRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Resort not found with ID: " + id
                        )
                );
    }

    // ============================================================
    // SEARCH RESORTS
    // ============================================================

    public List<Resort> searchResorts(String search) {

        if (search == null || search.trim().isEmpty()) {
            return getAllApprovedResorts();
        }

        String searchText = search.trim();

        /*
         * Firestore does not support the old JPA
         * Specification API.
         *
         * ResortRepository performs the
         * name/location search in Java.
         */
        return resortRepository
                .findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(
                        searchText,
                        searchText
                )
                .stream()
                .filter(resort ->
                        resort.getStatus() ==
                                Resort.ResortStatus.APPROVED
                )
                .toList();
    }

    // ============================================================
    // CREATE RESORT
    // ============================================================

    public Resort createResort(Resort resort) {

        Authentication auth =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (auth != null
                && auth.isAuthenticated()
                && !"anonymousUser".equals(auth.getPrincipal())) {

            String email = auth.getName();

            User user =
                    userRepository
                            .findByEmail(email)
                            .orElse(null);

            if (user != null) {

                /*
                 * Firestore uses an ownerId instead
                 * of a JPA User relationship.
                 */
                resort.setOwnerId(user.getId());

                /*
                 * Automatically approve partner resorts.
                 */
                if ("reservo2mail.in".equals(email)
                        || "reservo2@mail.in".equals(email)) {

                    resort.setStatus(
                            Resort.ResortStatus.APPROVED
                    );

                    log.info(
                            "Auto-approved resort '{}' for partner: {}",
                            resort.getName(),
                            email
                    );

                    return resortRepository.save(resort);
                }
            }
        }

        /*
         * Normal resorts require admin approval.
         */
        resort.setStatus(
                Resort.ResortStatus.PENDING_APPROVAL
        );

        return resortRepository.save(resort);
    }

    // ============================================================
    // FILTER RESORTS
    // ============================================================

    public List<Resort> filterResorts(
            String location,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Double minRating
    ) {

        /*
         * Firestore version of the old JPA
         * ResortSpecification.filterResorts().
         *
         * Load resorts and filter them in Java.
         */
        List<Resort> resorts =
                resortRepository.findAll();

        return resorts.stream()

                // Only approved resorts
                .filter(resort ->
                        resort.getStatus() ==
                                Resort.ResortStatus.APPROVED
                )

                // Location filter
                .filter(resort -> {

                    if (location == null
                            || location.isBlank()) {
                        return true;
                    }

                    return resort.getLocation() != null
                            && resort.getLocation()
                            .toLowerCase()
                            .contains(
                                    location
                                            .trim()
                                            .toLowerCase()
                            );
                })

                // Minimum price
                .filter(resort -> {

                    if (minPrice == null) {
                        return true;
                    }

                    return resort.getPricePerNight() != null
                            && resort.getPricePerNight()
                            .compareTo(minPrice) >= 0;
                })

                // Maximum price
                .filter(resort -> {

                    if (maxPrice == null) {
                        return true;
                    }

                    return resort.getPricePerNight() != null
                            && resort.getPricePerNight()
                            .compareTo(maxPrice) <= 0;
                })

                // Minimum rating
                .filter(resort -> {

                    if (minRating == null) {
                        return true;
                    }

                    return resort.getRating() != null
                            && resort.getRating() >= minRating;
                })

                .toList();
    }

    // ============================================================
    // GET RESORTS BY OWNER EMAIL
    // ============================================================

    public List<Resort> getResortsByOwnerEmail(
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);

        if (user == null) {
            return List.of();
        }

        return resortRepository.findByOwnerId(
                user.getId()
        );
    }

    // ============================================================
    // DELETE RESORT
    // ============================================================

    public void deleteResort(String resortId) {

        // Make sure resort exists first
        getResortById(resortId);

        resortRepository.deleteById(resortId);
    }
}