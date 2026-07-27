package com.reservo.backend.service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.reservo.backend.dto.ResortRequest;
import com.reservo.backend.dto.ResortResponse;
import com.reservo.backend.entity.Resort;

@Service
public class ResortService {

    private final List<Resort> resorts = new ArrayList<>();
    private Integer resortIdCounter = 1;

    public ResortResponse createResort(ResortRequest request) {

        Resort resort = new Resort();

        resort.setResortId(resortIdCounter++);
        resort.setResortName(request.getResortName());
        resort.setDescription(request.getDescription());
        resort.setAddress(request.getAddress());
        resort.setCity(request.getCity());
        resort.setState(request.getState());
        resort.setCountry(request.getCountry());
        resort.setZipcode(request.getZipcode());
        resort.setLatitude(request.getLatitude());
        resort.setLongitude(request.getLongitude());
        resort.setPhone(request.getPhone());
        resort.setEmail(request.getEmail());
        resort.setCheckInTime(request.getCheckInTime());
        resort.setCheckOutTime(request.getCheckOutTime());
        resort.setStarRating(request.getStarRating());
        resort.setStartingPrice(request.getStartingPrice());
        resort.setCancellationPolicy(request.getCancellationPolicy());

        resort.setAverageRating(BigDecimal.ZERO);
        resort.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        resorts.add(resort);

        return convertToResponse(resort);
    }

    public List<ResortResponse> getAllResorts() {

        List<ResortResponse> responseList = new ArrayList<>();

        for (Resort resort : resorts) {
            responseList.add(convertToResponse(resort));
        }

        return responseList;
    }

    public ResortResponse getResortById(Integer resortId) {

        for (Resort resort : resorts) {

            if (resort.getResortId().equals(resortId)) {
                return convertToResponse(resort);
            }
        }

        throw new RuntimeException("Resort not found with ID: " + resortId);
    }

    public ResortResponse updateResort(Integer resortId, ResortRequest request) {

        for (Resort resort : resorts) {

            if (resort.getResortId().equals(resortId)) {

                resort.setResortName(request.getResortName());
                resort.setDescription(request.getDescription());
                resort.setAddress(request.getAddress());
                resort.setCity(request.getCity());
                resort.setState(request.getState());
                resort.setCountry(request.getCountry());
                resort.setZipcode(request.getZipcode());
                resort.setLatitude(request.getLatitude());
                resort.setLongitude(request.getLongitude());
                resort.setPhone(request.getPhone());
                resort.setEmail(request.getEmail());
                resort.setCheckInTime(request.getCheckInTime());
                resort.setCheckOutTime(request.getCheckOutTime());
                resort.setStarRating(request.getStarRating());
                resort.setStartingPrice(request.getStartingPrice());
                resort.setCancellationPolicy(request.getCancellationPolicy());

                return convertToResponse(resort);
            }
        }

        throw new RuntimeException("Resort not found with ID: " + resortId);
    }

    public void deleteResort(Integer resortId) {

        for (Resort resort : resorts) {

            if (resort.getResortId().equals(resortId)) {

                resorts.remove(resort);
                return;
            }
        }

        throw new RuntimeException("Resort not found with ID: " + resortId);
    }

    private ResortResponse convertToResponse(Resort resort) {

        ResortResponse response = new ResortResponse();

        response.setResortId(resort.getResortId());
        response.setResortName(resort.getResortName());
        response.setDescription(resort.getDescription());
        response.setAddress(resort.getAddress());
        response.setCity(resort.getCity());
        response.setState(resort.getState());
        response.setCountry(resort.getCountry());
        response.setZipcode(resort.getZipcode());
        response.setLatitude(resort.getLatitude());
        response.setLongitude(resort.getLongitude());
        response.setPhone(resort.getPhone());
        response.setEmail(resort.getEmail());
        response.setCheckInTime(resort.getCheckInTime());
        response.setCheckOutTime(resort.getCheckOutTime());
        response.setStarRating(resort.getStarRating());
        response.setAverageRating(resort.getAverageRating());
        response.setStartingPrice(resort.getStartingPrice());
        response.setCancellationPolicy(resort.getCancellationPolicy());
        response.setCreatedAt(resort.getCreatedAt());

        return response;
    }
}