package com.hospital.backend.service;

import com.hospital.backend.entity.Review;
import java.util.List;
import java.util.Map;

public interface ReviewService {
    Review addReview(Review review);

    List<Review> getReviewsByDoctor(int doctorId);

    Map<String, Object> getDoctorRatingSummary(int doctorId);
}
