package com.hospital.backend.repository;

import com.hospital.backend.entity.Review;
import java.util.List;

public interface ReviewRepository {
    Review save(Review review);

    List<Review> findByDoctorId(int doctorId);

    List<Review> findByPatientId(int patientId);

    Double getAverageRating(int doctorId);
}
