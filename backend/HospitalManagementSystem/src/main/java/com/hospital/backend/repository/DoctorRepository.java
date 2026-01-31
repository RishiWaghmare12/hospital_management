package com.hospital.backend.repository;

import com.hospital.backend.entity.Doctor;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository {
    Doctor saveDoctor(Doctor doctor);

    List<Doctor> getAllDoctors();

    Optional<Doctor> getDoctorById(int id);

    Doctor updateDoctor(Doctor doctor);

    void deleteDoctor(int id);

    List<Doctor> getDoctorsBySpecialization(int specialization);

    List<Doctor> searchDoctorsByName(String name);

    Optional<Doctor> findByEmail(String email);

    boolean existsById(int id);

    int updatePassword(int id, String newPassword);
}