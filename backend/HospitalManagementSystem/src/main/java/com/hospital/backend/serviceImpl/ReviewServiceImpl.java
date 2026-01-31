package com.hospital.backend.serviceImpl;

import com.hospital.backend.entity.Review;
import com.hospital.backend.repository.ReviewRepository;
import com.hospital.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public Review addReview(Review review) {
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewsByDoctor(int doctorId) {
        return reviewRepository.findByDoctorId(doctorId);
    }

    @Override
    public Map<String, Object> getDoctorRatingSummary(int doctorId) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("averageRating", reviewRepository.getAverageRating(doctorId));
        summary.put("totalReviews", reviewRepository.findByDoctorId(doctorId).size());
        return summary;
    }
}
