package com.reservo.backend.service;

import com.reservo.backend.exception.ResourceNotFoundException;
import com.reservo.backend.entity.Resort;
import com.reservo.backend.repository.ResortRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResortService {

    private final ResortRepository resortRepository;

    public List<Resort> getAllApprovedResorts() {
        return resortRepository.findByStatus(Resort.ResortStatus.APPROVED);
    }

    public Resort getResortById(Long id) {
        return resortRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resort not found with ID: " + id));
    }

    public List<Resort> searchByLocation(String location) {
        return resortRepository.findByLocationContainingIgnoreCase(location);
    }

    public Resort createResort(Resort resort) {
        resort.setStatus(Resort.ResortStatus.PENDING_APPROVAL);
        return resortRepository.save(resort);
    }
}
