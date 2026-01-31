package com.hospital.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import jakarta.annotation.PostConstruct;

@Configuration
public class DatabaseInitializer {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void initialize() {
        System.out.println("Checking and updating database schema...");

        try {
            // Check if reset_token column exists in patient table
            addShortTextColumnIfNotExists("patient", "reset_token");
        } catch (Exception e) {
            System.err.println("Error checking/adding reset_token column: " + e.getMessage());
        }

        try {
            // Check if reset_token_expiry column exists in patient table
            addTimestampColumnIfNotExists("patient", "reset_token_expiry");
        } catch (Exception e) {
            System.err.println("Error checking/adding reset_token_expiry column: " + e.getMessage());
        }

        try {
            checkAndCreateReviewsTable();
        } catch (Exception e) {
            System.err.println("Error checking/creating reviews table: " + e.getMessage());
        }
    }

    private void checkAndCreateReviewsTable() {
        try {
            jdbcTemplate.queryForObject("SELECT count(*) FROM reviews", Integer.class);
            System.out.println("Table reviews already exists");
        } catch (Exception e) {
            System.out.println("Creating reviews table...");
            String sql = "CREATE TABLE reviews (" +
                    "id INT AUTO_INCREMENT PRIMARY KEY, " +
                    "patient_id INT NOT NULL, " +
                    "doctor_id INT NOT NULL, " +
                    "rating INT NOT NULL, " +
                    "comment TEXT, " +
                    "review_date DATETIME DEFAULT CURRENT_TIMESTAMP, " +
                    "FOREIGN KEY (patient_id) REFERENCES patient(P_ID) ON DELETE CASCADE, " +
                    "FOREIGN KEY (doctor_id) REFERENCES doctor(DR_ID) ON DELETE CASCADE" +
                    ")";
            jdbcTemplate.execute(sql);
            System.out.println("Table reviews created successfully");
        }
    }

    private void addShortTextColumnIfNotExists(String table, String column) {
        try {
            jdbcTemplate.queryForObject("SELECT " + column + " FROM " + table + " LIMIT 1", Object.class);
            System.out.println("Column " + column + " already exists in table " + table);
        } catch (Exception e) {
            // Column likely missing
            System.out.println("Adding missing column " + column + " to table " + table);
            jdbcTemplate.execute("ALTER TABLE " + table + " ADD COLUMN " + column + " VARCHAR(255) NULL");
        }
    }

    private void addTimestampColumnIfNotExists(String table, String column) {
        try {
            jdbcTemplate.queryForObject("SELECT " + column + " FROM " + table + " LIMIT 1", Object.class);
            System.out.println("Column " + column + " already exists in table " + table);
        } catch (Exception e) {
            // Column likely missing
            System.out.println("Adding missing column " + column + " to table " + table);
            jdbcTemplate.execute("ALTER TABLE " + table + " ADD COLUMN " + column + " TIMESTAMP NULL");
        }
    }
}
