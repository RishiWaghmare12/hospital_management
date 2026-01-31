package com.hospital.backend.repositoryImpl;

import com.hospital.backend.entity.Review;
import com.hospital.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class ReviewRepositoryImpl implements ReviewRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Review> reviewRowMapper = new RowMapper<Review>() {
        @Override
        public Review mapRow(ResultSet rs, int rowNum) throws SQLException {
            Review review = new Review();
            review.setId(rs.getInt("id"));
            review.setPatientId(rs.getInt("patient_id"));
            review.setDoctorId(rs.getInt("doctor_id"));
            review.setRating(rs.getInt("rating"));
            review.setComment(rs.getString("comment"));
            review.setReviewDate(rs.getObject("review_date", LocalDateTime.class));

            // Try to get patient name if joined
            try {
                String patientName = rs.getString("patient_name");
                if (patientName != null) {
                    review.setPatientName(patientName);
                }
            } catch (SQLException e) {
                // Column might not exist in this query, ignore
            }

            return review;
        }
    };

    @Override
    public Review save(Review review) {
        String sql = "INSERT INTO reviews (patient_id, doctor_id, rating, comment, review_date) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                review.getPatientId(),
                review.getDoctorId(),
                review.getRating(),
                review.getComment(),
                review.getReviewDate());
        return review;
    }

    @Override
    public List<Review> findByDoctorId(int doctorId) {
        // Join with patient table to get patient name
        String sql = "SELECT r.*, p.Name as patient_name FROM reviews r " +
                "LEFT JOIN patient p ON r.patient_id = p.P_ID " +
                "WHERE r.doctor_id = ? ORDER BY r.review_date DESC";
        return jdbcTemplate.query(sql, reviewRowMapper, doctorId);
    }

    @Override
    public List<Review> findByPatientId(int patientId) {
        String sql = "SELECT * FROM reviews WHERE patient_id = ? ORDER BY review_date DESC";
        return jdbcTemplate.query(sql, reviewRowMapper, patientId);
    }

    @Override
    public Double getAverageRating(int doctorId) {
        String sql = "SELECT AVG(rating) FROM reviews WHERE doctor_id = ?";
        Double avg = jdbcTemplate.queryForObject(sql, Double.class, doctorId);
        return avg != null ? avg : 0.0;
    }
}
