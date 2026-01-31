package com.hospital.backend.service;

import com.hospital.backend.entity.Doctor;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.PathVariable;

public interface DoctorService {
    Doctor saveDoctor(Doctor doctor);

    List<Doctor> getAllDoctors();

    Optional<Doctor> getDoctorById(int id);

    Doctor updateDoctor(int id, Doctor doctor);

    void deleteDoctor(int id);

    List<Doctor> getDoctorsBySpecialization(int specialization);

    List<Doctor> searchDoctorsByName(String name);

    Optional<Doctor> findByEmail(String email);

    boolean existsById(int id);

    Doctor changePassword(int id, String currentPassword, String newPassword);

}