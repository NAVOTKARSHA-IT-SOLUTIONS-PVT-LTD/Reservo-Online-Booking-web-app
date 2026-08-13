package com.reservo.backend.repository;

import com.reservo.backend.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCodeAndUserId(String code, Long userId);
    Optional<Coupon> findByCode(String code);
    long countByUserIdAndStatus(Long userId, Coupon.CouponStatus status);
}
