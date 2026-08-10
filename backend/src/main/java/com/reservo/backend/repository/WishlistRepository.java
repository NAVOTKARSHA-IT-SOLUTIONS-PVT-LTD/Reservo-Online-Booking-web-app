package com.reservo.backend.repository;

import com.reservo.backend.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserId(Long userId);
    Optional<Wishlist> findByUserIdAndResortId(Long userId, Long resortId);
    boolean existsByUserIdAndResortId(Long userId, Long resortId);
    void deleteByUserIdAndResortId(Long userId, Long resortId);
}
