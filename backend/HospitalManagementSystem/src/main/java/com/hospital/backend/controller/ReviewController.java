package com.hospital.backend.controller;

import com.hospital.backend.entity.Review;
import com.hospital.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Review addReview(@RequestBody Review review) {
        return reviewService.addReview(review);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Review> getDoctorReviews(@PathVariable int doctorId) {
        return reviewService.getReviewsByDoctor(doctorId);
    }

    @GetMapping("/doctor/{doctorId}/summary")
    public Map<String, Object> getDoctorRatingSummary(@PathVariable int doctorId) {
        return reviewService.getDoctorRatingSummary(doctorId);
    }
}
