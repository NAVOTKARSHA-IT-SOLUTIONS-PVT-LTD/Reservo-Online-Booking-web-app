package com.reservo.backend.service;

import com.reservo.backend.entity.Wishlist;
import com.reservo.backend.entity.Resort;
import com.reservo.backend.entity.User;
import com.reservo.backend.exception.ResourceNotFoundException;
import com.reservo.backend.repository.WishlistRepository;
import com.reservo.backend.repository.ResortRepository;
import com.reservo.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ResortRepository resortRepository;
    private final UserRepository userRepository;

    public List<Wishlist> getWishlistByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return wishlistRepository.findByUserId(user.getId());
    }

    @Transactional
    public String toggleWishlist(String email, Long resortId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Resort resort = resortRepository.findById(resortId)
                .orElseThrow(() -> new ResourceNotFoundException("Resort not found"));

        Optional<Wishlist> existing = wishlistRepository.findByUserIdAndResortId(user.getId(), resortId);
        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            return "Resort removed from wishlist";
        } else {
            Wishlist item = Wishlist.builder()
                    .user(user)
                    .resort(resort)
                    .build();
            wishlistRepository.save(item);
            return "Resort added to wishlist";
        }
    }

    @Transactional
    public void clearWishlist(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Wishlist> items = wishlistRepository.findByUserId(user.getId());
        wishlistRepository.deleteAll(items);
    }
}
