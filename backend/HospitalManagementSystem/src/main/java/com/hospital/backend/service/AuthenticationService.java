package com.hospital.backend.service;

import com.hospital.backend.entity.Doctor;
import com.hospital.backend.entity.Patient;
import com.hospital.backend.entity.LoginRequest;
import com.hospital.backend.entity.LoginResponse;

public interface AuthenticationService {
    LoginResponse authenticateDoctor(LoginRequest loginRequest);
    LoginResponse authenticatePatient(LoginRequest loginRequest);
    LoginResponse authenticateAdmin(LoginRequest loginRequest);
    void logout(String token);
    boolean validateToken(String token);
}