package com.reservo.backend.controller;

import com.reservo.backend.dto.ApiResponse;
import com.reservo.backend.entity.ResortDocument;
import com.reservo.backend.repository.ResortDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResortDocumentController {

    private final ResortDocumentRepository resortDocumentRepository;

    @GetMapping("/resort/{resortId}")
    public ResponseEntity<ApiResponse<List<ResortDocument>>> getDocumentsByResort(@PathVariable Long resortId) {
        return ResponseEntity.ok(ApiResponse.success(resortDocumentRepository.findByResortId(resortId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResortDocument>> uploadDocument(@RequestBody ResortDocument document) {
        ResortDocument saved = resortDocumentRepository.save(document);
        return ResponseEntity.ok(ApiResponse.success(saved, "Document uploaded for verification"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ResortDocument>> updateDocumentStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        ResortDocument doc = resortDocumentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        doc.setStatus(status);
        return ResponseEntity.ok(ApiResponse.success(resortDocumentRepository.save(doc), "Document verification status updated"));
    }
}
