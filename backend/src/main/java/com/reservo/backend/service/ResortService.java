package com.reservo.backend.service;

import com.reservo.backend.exception.ResourceNotFoundException;
import com.reservo.backend.entity.Resort;
import com.reservo.backend.entity.User;
import com.reservo.backend.repository.ResortRepository;
import com.reservo.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.reservo.backend.specification.ResortSpecification;
import java.math.BigDecimal;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResortService {

    private final ResortRepository resortRepository;
    private final UserRepository userRepository;

    public List<Resort> getAllApprovedResorts() {
        return resortRepository.findByStatus(Resort.ResortStatus.APPROVED);
    }

    public Resort getResortById(Long id) {
        return resortRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resort not found with ID: " + id));
    }

    public List<Resort> searchResorts(String search) {
        if (search == null || search.trim().isEmpty()) {
            return getAllApprovedResorts();
        }
        return resortRepository.findAll(ResortSpecification.searchResorts(search));
    }

    public Resort createResort(Resort resort) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            String email = auth.getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                resort.setOwner(user);

                if ("reservo2mail.in".equals(email) || "reservo2@mail.in".equals(email)) {
                    resort.setStatus(Resort.ResortStatus.APPROVED);
                    log.info("Auto-approved resort '{}' for partner: {}", resort.getName(), email);
                    return resortRepository.save(resort);
                }
            }
        }

        resort.setStatus(Resort.ResortStatus.PENDING_APPROVAL);
        return resortRepository.save(resort);
    }
    public List<Resort> filterResorts(
        String location,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        Double minRating) {

        return resortRepository.findAll(
            ResortSpecification.filterResorts(
                    location,
                    minPrice,
                    maxPrice,
                    minRating
            )
    );
    }
}
