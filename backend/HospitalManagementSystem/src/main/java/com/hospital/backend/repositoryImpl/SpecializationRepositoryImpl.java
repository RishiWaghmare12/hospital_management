package com.hospital.backend.repositoryImpl;

import com.hospital.backend.entity.Specialization;
import com.hospital.backend.repository.SpecializationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class SpecializationRepositoryImpl implements SpecializationRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Specialization> specializationRowMapper = new RowMapper<Specialization>() {
        @Override
        public Specialization mapRow(ResultSet rs, int rowNum) throws SQLException {
            Specialization specialization = new Specialization();
            specialization.setSpId(rs.getInt("Sp_Id"));
            specialization.setSpName(rs.getString("Sp_Name"));
            return specialization;
        }
    };

    @Override
    public Optional<Specialization> getSpecializationByName(String name) {
        String sql = "SELECT * FROM speclization WHERE Sp_Name = ?";
        List<Specialization> specializations = jdbcTemplate.query(sql, specializationRowMapper, name);
        return specializations.isEmpty() ? Optional.empty() : Optional.of(specializations.get(0));
    }


    @Override
    public Specialization createSpecialization(Specialization specialization) {
        if (specialization.getSpId() == 0) {
            String sql = "INSERT INTO speclization (Sp_Name) VALUES (?)";
            jdbcTemplate.update(sql, specialization.getSpName());
            return specialization;
        } else {
            String sql = "UPDATE speclization SET Sp_Name = ? WHERE Sp_Id = ?";
            jdbcTemplate.update(sql,
                specialization.getSpName(),
                specialization.getSpId());
            return specialization;
        }
    }
  
    @Override
    public void deleteSpecialization(int id) {
        String sql = "DELETE FROM speclization WHERE Sp_Id = ?";
        jdbcTemplate.update(sql, id);
    }
   
    @Override
    public List<Specialization> getAllSpecializations() {
        String sql = "SELECT * FROM speclization";
        return jdbcTemplate.query(sql, specializationRowMapper);
    }
   
    @Override
    public Specialization updateSpecialization(Specialization specialization) {
        if (specialization.getSpId() == 0) {
            throw new IllegalArgumentException("Specialization ID must be provided for update");
        }
        return createSpecialization(specialization);
    }

    @Override
    public boolean existsById(int id) {
        String sql = "SELECT COUNT(*) FROM speclization WHERE Sp_Id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }
    
    @Override
    public Optional<Specialization> getSpecializationById(int id) {
        String sql = "SELECT * FROM speclization WHERE Sp_Id = ?";
        List<Specialization> specializations = jdbcTemplate.query(sql, specializationRowMapper, id);
        return specializations.isEmpty() ? Optional.empty() : Optional.of(specializations.get(0));
    }
}