package com.hospital.backend.repositoryImpl;

import com.hospital.backend.entity.Doctor;
import com.hospital.backend.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class DoctorRepositoryImpl implements DoctorRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Doctor> doctorRowMapper = new RowMapper<Doctor>() {
        @Override
        public Doctor mapRow(ResultSet rs, int rowNum) throws SQLException {
            Doctor doctor = new Doctor();
            doctor.setDrId(rs.getInt("DR_ID"));
            doctor.setDrName(rs.getString("Dr_name"));
            doctor.setMobileNo(rs.getString("Mobile_no"));
            doctor.setEmailId(rs.getString("Email_id"));
            doctor.setGender(rs.getString("Gender"));
            doctor.setAge(rs.getInt("Age"));
            doctor.setExperience(rs.getInt("Experience"));
            doctor.setPassword(rs.getString("Password"));
            doctor.setSpId(rs.getInt("Sp_Id"));
            doctor.setPicture(rs.getString("picture"));
            return doctor;
        }
    };

    @Override
    public Optional<Doctor> getDoctorById(int id) {
        String sql = "SELECT * FROM doctor WHERE DR_ID = ?";
        List<Doctor> doctors = jdbcTemplate.query(sql, doctorRowMapper, id);
        return doctors.isEmpty() ? Optional.empty() : Optional.of(doctors.get(0));
    }

    @Override
    public Optional<Doctor> findByEmail(String email) {
        String sql = "SELECT * FROM doctor WHERE Email_id = ?";
        List<Doctor> doctors = jdbcTemplate.query(sql, doctorRowMapper, email);
        return doctors.isEmpty() ? Optional.empty() : Optional.of(doctors.get(0));
    }

    @Override
    public List<Doctor> searchDoctorsByName(String name) {
        String sql = "SELECT * FROM doctor WHERE LOWER(Dr_name) LIKE LOWER(?)";
        return jdbcTemplate.query(sql, doctorRowMapper, "%" + name + "%");
    }

    @Override
    public Doctor saveDoctor(Doctor doctor) {
        if (doctor.getDrId() == 0) {
            String sql = "INSERT INTO doctor (Dr_name, Mobile_no, Email_id, Gender, Age, Experience, Password, Sp_Id, picture) "
                    +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

            jdbcTemplate.update(sql,
                    doctor.getDrName(),
                    doctor.getMobileNo(),
                    doctor.getEmailId(),
                    doctor.getGender(),
                    doctor.getAge(),
                    doctor.getExperience(),
                    doctor.getPassword(),
                    doctor.getSpId(),
                    doctor.getPicture()); // Added this parameter to the method call

            return doctor;
        } else {
            // You need to add an else block here or handle updates else {
            String sql = "UPDATE doctor SET Dr_name = ?, Mobile_no = ?, Email_id = ?, Gender = ?, Age = ?, Experience = ?, Sp_Id = ?, picture = ? WHERE DR_ID = ?";
            jdbcTemplate.update(sql,
                    doctor.getDrName(),
                    doctor.getMobileNo(),
                    doctor.getEmailId(),
                    doctor.getGender(),
                    doctor.getAge(),
                    doctor.getExperience(),
                    doctor.getSpId(),
                    doctor.getPicture(),
                    doctor.getDrId());
            return doctor;
        }

    }

    @Override
    public void deleteDoctor(int id) {
        String sql = "DELETE FROM doctor WHERE DR_ID = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public List<Doctor> getAllDoctors() {
        String sql = "SELECT * FROM doctor";
        return jdbcTemplate.query(sql, doctorRowMapper);
    }

    @Override
    public Doctor updateDoctor(Doctor doctor) {
        if (doctor.getDrId() == 0) {
            throw new IllegalArgumentException("Doctor ID must be provided for update");
        }
        return saveDoctor(doctor);
    }

    @Override
    public List<Doctor> getDoctorsBySpecialization(int specialization) {
        String sql = "SELECT d.* FROM doctor d JOIN speclization s ON d.Sp_Id = s.Sp_Id WHERE s.Sp_Id = ?";
        return jdbcTemplate.query(sql, doctorRowMapper, specialization);
    }

    @Override
    public boolean existsById(int id) {
        String sql = "SELECT COUNT(*) FROM doctor WHERE DR_ID = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    @Override
    public int updatePassword(int id, String newPassword) {
        String sql = "UPDATE doctor SET Password = ? WHERE DR_ID = ?";
        return jdbcTemplate.update(sql, newPassword, id);
    }

}