package com.reservo.backend.specification;

import com.reservo.backend.entity.Resort;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ResortSpecification {

    public static Specification<Resort> filterResorts(
            String location,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Double minRating) {

        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            predicates.add(
                    criteriaBuilder.equal(
                            root.get("status"),
                            Resort.ResortStatus.APPROVED
                    )
            );

            if (location != null && !location.isBlank()) {
                predicates.add(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("location")),
                                "%" + location.toLowerCase() + "%"
                        )
                );
            }

            if (minPrice != null) {
                predicates.add(
                        criteriaBuilder.greaterThanOrEqualTo(
                                root.get("pricePerNight"),
                                minPrice
                        )
                );
            }

            if (maxPrice != null) {
                predicates.add(
                        criteriaBuilder.lessThanOrEqualTo(
                                root.get("pricePerNight"),
                                maxPrice
                        )
                );
            }

            if (minRating != null) {
                predicates.add(
                        criteriaBuilder.greaterThanOrEqualTo(
                                root.get("rating"),
                                minRating
                        )
                );
            }

            return criteriaBuilder.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }
}
