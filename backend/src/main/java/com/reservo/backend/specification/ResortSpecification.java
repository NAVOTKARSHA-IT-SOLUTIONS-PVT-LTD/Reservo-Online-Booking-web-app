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

    public static Specification<Resort> searchResorts(String search) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(
                    criteriaBuilder.equal(
                            root.get("status"),
                            Resort.ResortStatus.APPROVED
                    )
            );

            if (search != null && !search.isBlank()) {
                String[] terms = search.trim().split("[,\\s]+");
                List<Predicate> termPredicates = new ArrayList<>();
                for (String term : terms) {
                    if (!term.isBlank()) {
                        String pattern = "%" + term.toLowerCase() + "%";
                        termPredicates.add(
                                criteriaBuilder.or(
                                        criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern),
                                        criteriaBuilder.like(criteriaBuilder.lower(root.get("location")), pattern),
                                        criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), pattern)
                                )
                        );
                    }
                }
                if (!termPredicates.isEmpty()) {
                    predicates.add(criteriaBuilder.or(termPredicates.toArray(new Predicate[0])));
                }
            }

            return criteriaBuilder.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }
}
