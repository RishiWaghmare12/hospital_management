package com.hospital.backend.serviceImpl;

import com.hospital.backend.entity.LoginRequest;
import com.hospital.backend.entity.LoginResponse;
import com.hospital.backend.entity.Doctor;
import com.hospital.backend.entity.Patient;
import com.hospital.backend.service.AuthenticationService;
import com.hospital.backend.service.AdminService;
import com.hospital.backend.entity.Admin;
import com.hospital.backend.service.DoctorService;
import com.hospital.backend.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private AdminService adminService;

    private final Map<String, String> tokenUserMap = new HashMap<>();
    private final String ADMIN_EMAIL_FALLBACK = "admin@hospital.com";
    private final String ADMIN_PASSWORD_FALLBACK = "admin123";

    @Override
    public LoginResponse authenticateDoctor(LoginRequest loginRequest) {
        // Check if email is provided
        if (loginRequest.getEmail() == null || loginRequest.getEmail().isEmpty()) {
            return new LoginResponse(null, "DOCTOR", 0, null, null, "Email is required", false);
        }

        // Check if password is provided
        if (loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
            return new LoginResponse(null, "DOCTOR", 0, null, null, "Password is required", false);
        }

        Optional<Doctor> doctor = doctorService.findByEmail(loginRequest.getEmail());
        
        if (!doctor.isPresent()) {
            return new LoginResponse(null, "DOCTOR", 0, null, null, "Doctor not found with this email", false);
        }
        
        if (!loginRequest.getPassword().equals(doctor.get().getPassword())) {
            return new LoginResponse(null, "DOCTOR", 0, null, null, "Incorrect password", false);
        }

        // If we reach here, credentials are valid
        String token = generateToken();
        tokenUserMap.put(token, "DOCTOR_" + doctor.get().getDrId());
        
        return new LoginResponse(
            token,
            "DOCTOR",
            doctor.get().getDrId(),
            doctor.get().getDrName(),
            doctor.get().getEmailId(),
            "Login successful",
            true
        );
    }

    @Override
    public LoginResponse authenticatePatient(LoginRequest loginRequest) {
        // Check if email is provided
        if (loginRequest.getEmail() == null || loginRequest.getEmail().isEmpty()) {
            return new LoginResponse(null, "PATIENT", 0, null, null, "Email is required", false);
        }

        // Check if password is provided
        if (loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
            return new LoginResponse(null, "PATIENT", 0, null, null, "Password is required", false);
        }

        Optional<Patient> patient = patientService.findByEmail(loginRequest.getEmail());
        
        if (!patient.isPresent()) {
            return new LoginResponse(null, "PATIENT", 0, null, null, "Patient not found with this email", false);
        }
        
        if (!loginRequest.getPassword().equals(patient.get().getPassword())) {
            return new LoginResponse(null, "PATIENT", 0, null, null, "Incorrect password", false);
        }

        // If we reach here, credentials are valid
        String token = generateToken();
        tokenUserMap.put(token, "PATIENT_" + patient.get().getpId());
        
        return new LoginResponse(
            token,
            "PATIENT",
            patient.get().getpId(),
            patient.get().getName(),
            patient.get().getEmail(),
            "Login successful",
            true
        );
    }

    @Override
    public LoginResponse authenticateAdmin(LoginRequest loginRequest) {
        // Check if email is provided
        if (loginRequest.getEmail() == null || loginRequest.getEmail().isEmpty()) {
            return new LoginResponse(null, "ADMIN", 0, null, null, "Email is required", false);
        }

        // Check if password is provided
        if (loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
            return new LoginResponse(null, "ADMIN", 0, null, null, "Password is required", false);
        }

        // First try DB-backed admin
        Optional<Admin> adminOpt = adminService.findByEmail(loginRequest.getEmail());
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (!loginRequest.getPassword().equals(admin.getPassword())) {
                return new LoginResponse(null, "ADMIN", 0, null, null, "Invalid admin password", false);
            }
            String token = generateToken();
            tokenUserMap.put(token, "ADMIN_" + admin.getAd_ID());
            return new LoginResponse(
                token,
                "ADMIN",
                admin.getAd_ID(),
                admin.getName(),
                admin.getEmail(),
                "Login successful",
                true
            );
        }

        // Fallback to legacy hardcoded admin in case DB is empty
        if (!loginRequest.getEmail().equals(ADMIN_EMAIL_FALLBACK)) {
            return new LoginResponse(null, "ADMIN", 0, null, null, "Invalid admin email", false);
        }
        if (!loginRequest.getPassword().equals(ADMIN_PASSWORD_FALLBACK)) {
            return new LoginResponse(null, "ADMIN", 0, null, null, "Invalid admin password", false);
        }

        // If we reach here, credentials are valid
        String token = generateToken();
        tokenUserMap.put(token, "ADMIN");
        
        return new LoginResponse(
            token,
            "ADMIN",
            0,
            "Admin",
            ADMIN_EMAIL_FALLBACK,
            "Login successful",
            true
        );
    }

    @Override
    public void logout(String token) {
        tokenUserMap.remove(token);
    }

    @Override
    public boolean validateToken(String token) {
        return tokenUserMap.containsKey(token);
    }

    private String generateToken() {
        return UUID.randomUUID().toString();
    }
}