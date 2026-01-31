package com.hospital.backend.serviceImpl;

import com.hospital.backend.entity.Doctor;
import com.hospital.backend.repository.DoctorRepository;
import com.hospital.backend.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Doctor saveDoctor(Doctor doctor) {
        // Add null check for password
        if (doctor.getPassword() != null && !doctor.getPassword().isEmpty()) {
            // Skip encoding - use password as-is
            System.out.println("Password received: " + doctor.getPassword()); // Debug log
            // Note: password will be stored as plain text
        } else {
            throw new IllegalArgumentException("Password cannot be empty");
        }

        return doctorRepository.saveDoctor(doctor);
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.getAllDoctors();
    }

    @Override
    public Optional<Doctor> getDoctorById(int id) {
        return doctorRepository.getDoctorById(id);
    }

    @Override
    public Doctor updateDoctor(int id, Doctor doctor) {
        if (doctorRepository.existsById(id)) {
            doctor.setDrId(id);
            return doctorRepository.updateDoctor(doctor);
        }
        throw new RuntimeException("Doctor not found with id: " + id);
    }

    @Override
    public void deleteDoctor(int id) {
        doctorRepository.deleteDoctor(id);
    }

    @Override
    public Optional<Doctor> findByEmail(String email) {
        return doctorRepository.findByEmail(email);
    }

    @Override
    public List<Doctor> getDoctorsBySpecialization(int specialization) {
        return doctorRepository.getDoctorsBySpecialization(specialization);
    }

    @Override
    public List<Doctor> searchDoctorsByName(String name) {
        return doctorRepository.searchDoctorsByName(name);
    }

    @Override
    public boolean existsById(int id) {
        return doctorRepository.existsById(id);
    }

    @Override
    public Doctor changePassword(int id, String currentPassword, String newPassword) {
        System.out.println("Changing password for doctor ID: " + id);

        // Get doctor by ID
        Doctor doctor = doctorRepository.getDoctorById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));

        // Validate current password
        if (!currentPassword.equals(doctor.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Update password
        int rowsUpdated = doctorRepository.updatePassword(id, newPassword);

        if (rowsUpdated == 0) {
            throw new RuntimeException("Failed to update password, no rows affected");
        }

        // Return the updated doctor
        doctor.setPassword(newPassword);
        return doctor;
    }

}