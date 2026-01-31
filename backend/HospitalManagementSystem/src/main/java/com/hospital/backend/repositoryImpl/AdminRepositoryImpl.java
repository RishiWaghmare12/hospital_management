package com.hospital.backend.repositoryImpl;

import com.hospital.backend.entity.Admin;
import com.hospital.backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class AdminRepositoryImpl implements AdminRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Admin> adminRowMapper = new RowMapper<Admin>() {
        @Override
        public Admin mapRow(ResultSet rs, int rowNum) throws SQLException {
            Admin admin = new Admin();
            admin.setAd_ID(rs.getInt("Ad_ID"));
            admin.setName(rs.getString("Name"));
            admin.setEmail(rs.getString("Email"));
            admin.setPassword(rs.getString("Password"));
            return admin;
        }
    };

    @Override
    public Optional<Admin> findByEmail(String email) {
        String sql = "SELECT * FROM admin WHERE Email = ?";
        List<Admin> admins = jdbcTemplate.query(sql, adminRowMapper, email);
        return admins.isEmpty() ? Optional.empty() : Optional.of(admins.get(0));
    }

    @Override
    public Admin save(Admin admin) {
        if (admin.getAd_ID() == 0) {
            String sql = "INSERT INTO admin (Name, Email, Password) VALUES (?, ?, ?)";
            jdbcTemplate.update(sql, admin.getName(), admin.getEmail(), admin.getPassword());
            return admin;
        } else {
            String sql = "UPDATE admin SET Name = ?, Email = ?, Password = ? WHERE Ad_ID = ?";
            jdbcTemplate.update(sql, admin.getName(), admin.getEmail(), admin.getPassword(), admin.getAd_ID());
            return admin;
        }
    }
}
