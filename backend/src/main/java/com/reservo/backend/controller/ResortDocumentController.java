package com.reservo.backend.controller;

import com.reservo.backend.dto.ApiResponse;
import com.reservo.backend.entity.ResortDocument;
import com.reservo.backend.repository.ResortDocumentRepository;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class ResortDocumentController {

    private final ResortDocumentRepository resortDocumentRepository;
    private final Path fileStorageLocation = Paths.get("uploads/documents").toAbsolutePath().normalize();

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @GetMapping("/resort/{resortId}")
    public ResponseEntity<ApiResponse<List<ResortDocument>>> getDocumentsByResort(@PathVariable Long resortId) {
        return ResponseEntity.ok(ApiResponse.success(resortDocumentRepository.findByResortId(resortId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResortDocument>> uploadDocument(@RequestBody ResortDocument document) {
        ResortDocument saved = resortDocumentRepository.save(document);
        return ResponseEntity.ok(ApiResponse.success(saved, "Document uploaded for verification"));
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID().toString() + extension;
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String fileDownloadUrl = "/api/v1/documents/files/" + fileName;
            
            Map<String, String> data = new HashMap<>();
            data.put("fileName", originalFileName);
            data.put("fileUrl", fileDownloadUrl);
            data.put("fileSize", String.format("%.1f MB", (double) file.getSize() / (1024 * 1024)));

            return ResponseEntity.ok(ApiResponse.success(data, "File uploaded successfully"));
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file. Please try again!", ex);
        }
    }

    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename, HttpServletRequest request) {
        try {
            Path filePath = this.fileStorageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                String contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build();
        }
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
