package com.reservo.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reservo.backend.dto.ResortRequest;
import com.reservo.backend.dto.ResortResponse;
import com.reservo.backend.service.ResortService;

@RestController
@RequestMapping("/api/resorts")
@CrossOrigin(origins = "*")
public class ResortController {

    @Autowired
    private ResortService resortService;


    @PostMapping
    public ResponseEntity<ResortResponse> createResort(@RequestBody ResortRequest request) {

        ResortResponse response = resortService.createResort(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<List<ResortResponse>> getAllResorts() {

        List<ResortResponse> resorts = resortService.getAllResorts();

        return ResponseEntity.ok(resorts);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ResortResponse> getResortById(@PathVariable Integer id) {

        ResortResponse resort = resortService.getResortById(id);

        return ResponseEntity.ok(resort);
    }


    @PutMapping("/{id}")
    public ResponseEntity<ResortResponse> updateResort(
            @PathVariable Integer id,
            @RequestBody ResortRequest request) {

        ResortResponse updatedResort = resortService.updateResort(id, request);

        return ResponseEntity.ok(updatedResort);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResort(@PathVariable Integer id) {

        resortService.deleteResort(id);

        return ResponseEntity.ok("Resort deleted successfully.");
    }
}
