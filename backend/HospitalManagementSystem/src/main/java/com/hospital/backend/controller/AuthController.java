package com.hospital.backend.controller;
import com.hospital.backend.entity.LoginRequest;
import com.hospital.backend.entity.LoginResponse;
import com.hospital.backend.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/doctor/login")
    public LoginResponse doctorLogin(@RequestBody LoginRequest loginRequest) {
        return authenticationService.authenticateDoctor(loginRequest);
    }

    @PostMapping("/patient/login")
    public LoginResponse patientLogin(@RequestBody LoginRequest loginRequest) {
        return authenticationService.authenticatePatient(loginRequest);
    }

    @PostMapping("/admin/login")
    public LoginResponse adminLogin(@RequestBody LoginRequest loginRequest) {
        return authenticationService.authenticateAdmin(loginRequest);
    }

    @PostMapping("/logout")
    public void logout(@RequestHeader("Authorization") String token) {
        authenticationService.logout(token);
    }

    @GetMapping("/validate")
    public boolean validateToken(@RequestHeader("Authorization") String token) {
        return authenticationService.validateToken(token);
    }
}