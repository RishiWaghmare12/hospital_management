package com.hospital.backend.repositoryImpl;

import com.hospital.backend.entity.Patient;
import com.hospital.backend.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class PatientRepositoryImpl implements PatientRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    private final RowMapper<Patient> patientRowMapper = new RowMapper<Patient>() {
        @Override
        public Patient mapRow(ResultSet rs, int rowNum) throws SQLException {
            Patient patient = new Patient();
            patient.setpId(rs.getInt("P_ID"));
            patient.setName(rs.getString("Name"));
            patient.setDob(rs.getObject("DOB", LocalDate.class));
            patient.setAge(rs.getInt("Age"));
            patient.setGender(rs.getString("Gender"));
            patient.setBloodGroup(rs.getString("Blood_Group"));
            patient.setMobileNo(rs.getString("Mobile_No"));
            patient.setEmail(rs.getString("Email"));
            patient.setAddress(rs.getString("Address"));
            patient.setPassword(rs.getString("Password"));
            patient.setResetToken(rs.getString("reset_token"));
            patient.setResetTokenExpiryDate(rs.getObject("reset_token_expiry", java.time.LocalDateTime.class));
            return patient;
        }
    };

    @Override
    public Optional<Patient> getPatientById(int id) {
        String sql = "SELECT * FROM patient WHERE P_ID = ?";
        List<Patient> patients = jdbcTemplate.query(sql, patientRowMapper, id);
        return patients.isEmpty() ? Optional.empty() : Optional.of(patients.get(0));
    }

    @Override
    public Optional<Patient> findByEmail(String email) {
        String sql = "SELECT * FROM patient WHERE Email = ?";
        List<Patient> patients = jdbcTemplate.query(sql, patientRowMapper, email);
        return patients.isEmpty() ? Optional.empty() : Optional.of(patients.get(0));
    }

    @Override
    public List<Patient> getPatientsByBloodGroup(String bloodGroup) {
        String sql = "SELECT * FROM patient WHERE Blood_Group = ?";
        return jdbcTemplate.query(sql, patientRowMapper, bloodGroup);
    }

    @Override
    public List<Patient> searchPatientsByName(String name) {
        String sql = "SELECT * FROM patient WHERE LOWER(name) LIKE LOWER(?)";
        return jdbcTemplate.query(sql, patientRowMapper, "%" + name + "%");
    }

    @Override
    public List<Patient> findByContactContaining(String contact) {
        String sql = "SELECT * FROM patient WHERE Mobile_No LIKE ?";
        return jdbcTemplate.query(sql, patientRowMapper, "%" + contact + "%");
    }

    @Override
    public Patient save(Patient patient) {
        if (patient.getpId() == 0) {
            String sql = "INSERT INTO patient (Name, DOB, Age, Gender, Blood_Group, Mobile_No, Email, Address, Password, reset_token, reset_token_expiry) "
                    +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql,
                    patient.getName(),
                    patient.getDob(),
                    patient.getAge(),
                    patient.getGender(),
                    patient.getBloodGroup(),
                    patient.getMobileNo(),
                    patient.getEmail(),
                    patient.getAddress(),
                    patient.getPassword(),
                    patient.getResetToken(),
                    patient.getResetTokenExpiryDate());
            return patient;
        } else {
            if (patient.getName() == null || patient.getName().trim().isEmpty()) {
                throw new IllegalArgumentException("Patient name cannot be null or empty");
            }
            String sql = "UPDATE patient SET Name = ?, DOB = ?, Age = ?, Gender = ?, " +
                    "Blood_Group = ?, Mobile_No = ?, Email = ?, Address = ?, Password = ?, reset_token = ?, reset_token_expiry = ? WHERE P_ID = ?";
            jdbcTemplate.update(sql,
                    patient.getName(),
                    patient.getDob(),
                    patient.getAge(),
                    patient.getGender(),
                    patient.getBloodGroup(),
                    patient.getMobileNo(),
                    patient.getEmail(),
                    patient.getAddress(),
                    patient.getPassword(),
                    patient.getResetToken(),
                    patient.getResetTokenExpiryDate(),
                    patient.getpId());
            return patient;
        }
    }

    @Override
    public void deletePatient(int id) {
        String sql = "DELETE FROM patient WHERE P_ID = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public List<Patient> getAllPatients() {
        String sql = "SELECT * FROM patient";
        try {
            return jdbcTemplate.query(sql, patientRowMapper);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public Patient update(Patient patient) {
        if (patient.getpId() == 0) {
            throw new IllegalArgumentException("Patient ID must be provided for update");
        }
        return save(patient);
    }

    @Override
    public boolean existsById(int id) {
        String sql = "SELECT COUNT(*) FROM patient WHERE P_ID = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    @Override
    public List<Patient> findByDoctorId(int doctorId) {
        String sql = "SELECT DISTINCT p.* FROM patient p JOIN appointment a ON p.P_ID = a.P_ID WHERE a.DR_ID = ?";
        return jdbcTemplate.query(sql, patientRowMapper, doctorId);
    }

    @Override
    public int updatePassword(int id, String newPassword) {
        String sql = "UPDATE patient SET Password = ? WHERE P_ID = ?";
        System.out.println("Executing SQL: " + sql.replace("?", "_") +
                " with params: [" + newPassword + ", " + id + "]");
        int rowsAffected = jdbcTemplate.update(sql, newPassword, id);
        System.out.println("SQL execution complete, rows affected: " + rowsAffected);
        return rowsAffected;
    }

    @Override
    public Optional<Patient> findByResetToken(String token) {
        String sql = "SELECT * FROM patient WHERE reset_token = ?";
        List<Patient> patients = jdbcTemplate.query(sql, patientRowMapper, token);
        return patients.isEmpty() ? Optional.empty() : Optional.of(patients.get(0));
    }

}