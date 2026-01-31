package com.hospital.backend.repository;

import com.hospital.backend.entity.Patient;
import java.util.List;
import java.util.Optional;

public interface PatientRepository {
    Optional<Patient> getPatientById(int id);

    Optional<Patient> findByEmail(String email);

    List<Patient> searchPatientsByName(String name);

    List<Patient> findByContactContaining(String contact);

    Patient save(Patient patient);

    void deletePatient(int id);

    List<Patient> getAllPatients();

    Patient update(Patient patient);

    List<Patient> getPatientsByBloodGroup(String bloodGroup);

    boolean existsById(int id);

    List<Patient> findByDoctorId(int doctorId);

    int updatePassword(int id, String newPassword);

    Optional<Patient> findByResetToken(String token);
}