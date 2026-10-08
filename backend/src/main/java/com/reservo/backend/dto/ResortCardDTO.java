package com.reservo.backend.dto;

import com.reservo.backend.entity.Resort;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Lightweight DTO projection for resort cards and search result listings.
 * Eliminates heavy multi-paragraph descriptions, large gallery strings,
 * and internal audit fields to reduce network payload by over 70%.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResortCardDTO {

    private String id;
    private String name;
    private String location;
    private String city;
    private String state;
    private String country;
    private String imageUrl;
    private BigDecimal pricePerNight;
    private Double rating;
    private Integer reviewCount;
    private String featuredTag;
    private String category;
    private Integer discountPercentage;
    private String listingMode;
    private Resort.ResortStatus status;
    private String highlights;
    private String amenities;
    private Boolean instantBook;
    private Integer guests;
    private Integer bedrooms;
    private Integer beds;
    private Integer bathrooms;

    public static ResortCardDTO fromEntity(Resort resort) {
        if (resort == null) {
            return null;
        }

        return ResortCardDTO.builder()
                .id(resort.getId())
                .name(resort.getName())
                .location(resort.getLocation())
                .city(resort.getCity())
                .state(resort.getState())
                .country(resort.getCountry())
                .imageUrl(resort.getImageUrl())
                .pricePerNight(resort.getPricePerNight())
                .rating(resort.getRating() != null ? resort.getRating() : 4.5)
                .reviewCount(resort.getReviewCount() != null ? resort.getReviewCount() : 0)
                .featuredTag(resort.getFeaturedTag())
                .category(resort.getCategory())
                .discountPercentage(resort.getDiscountPercentage())
                .listingMode(resort.getListingMode())
                .status(resort.getStatus())
                .highlights(resort.getHighlights())
                .amenities(resort.getAmenities())
                .instantBook(resort.getInstantBook())
                .guests(resort.getGuests())
                .bedrooms(resort.getBedrooms())
                .beds(resort.getBeds())
                .bathrooms(resort.getBathrooms())
                .build();
    }
}
