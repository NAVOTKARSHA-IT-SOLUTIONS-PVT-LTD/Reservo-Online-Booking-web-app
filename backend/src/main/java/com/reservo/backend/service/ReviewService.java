package com.reservo.backend.service;

import com.reservo.backend.entity.Review;
import com.reservo.backend.entity.Resort;
import com.reservo.backend.entity.User;
import com.reservo.backend.exception.ResourceNotFoundException;
import com.reservo.backend.repository.ReviewRepository;
import com.reservo.backend.repository.ResortRepository;
import com.reservo.backend.repository.UserRepository;
import com.reservo.backend.repository.BookingRepository;
import com.reservo.backend.util.HtmlSanitizer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ResortRepository resortRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public List<Review> getReviewsByResort(String resortId) {
        return reviewRepository.findByResortId(resortId);
    }

    public Review createReview(String email, String resortId, String bookingId, Double rating, String comment) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Resort resort = resortRepository.findById(resortId)
                .orElseThrow(() -> new ResourceNotFoundException("Resort not found"));

        if (rating == null || rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }
        if (bookingId == null || bookingId.isBlank()) {
            throw new IllegalArgumentException("A completed booking is required to submit a review.");
        }

        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!user.getId().equals(booking.getUserId())) {
            throw new IllegalStateException("You can only review your own booking.");
        }
        if (!resort.getId().equals(booking.getResortId()) || !resortId.equals(booking.getResortId())) {
            throw new IllegalStateException("The booking does not belong to this resort.");
        }
        if (booking.getStatus() != com.reservo.backend.entity.Booking.BookingStatus.COMPLETED) {
            throw new IllegalStateException("You can review a resort only after the stay is completed.");
        }
        if (reviewRepository.findByBookingId(bookingId).isPresent()) {
            throw new IllegalStateException("You have already reviewed this booking.");
        }

        Review review = Review.builder()
                .userId(user.getId())
                .resortId(resort.getId())
                .bookingId(bookingId)
                .rating(rating)
                .comment(HtmlSanitizer.sanitize(comment))
                .build();

        Review saved = reviewRepository.save(review);
        List<Review> reviews = reviewRepository.findByResortId(resortId);
        double avgRating = reviews.stream().mapToDouble(Review::getRating).average().orElse(rating);
        resort.setRating(avgRating);
        resort.setReviewCount(reviews.size());
        resortRepository.save(resort);
        return saved;
    }
}
