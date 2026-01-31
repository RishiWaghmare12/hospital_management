package com.hospital.backend.service;

import com.hospital.backend.entity.Patient;
import java.util.List;
import java.util.Optional;

public interface PatientService {
    Patient save(Patient patient);

    List<Patient> getAllPatients();

    Optional<Patient> getPatientById(int id);

    Patient updatePatient(int id, Patient patient);

    void deletePatient(int id);

    Optional<Patient> findByEmail(String email);

    List<Patient> getPatientsByBloodGroup(String bloodGroup);

    boolean existsById(int id);

    public List<Patient> searchPatientsByName(String name);

    List<Patient> findByContactContaining(String contact);

    List<Patient> findByDoctorId(int doctorId);

    Patient changePassword(int id, String currentPassword, String newPassword);

    void initiatePasswordReset(String email);

    void resetPassword(String token, String newPassword);
}