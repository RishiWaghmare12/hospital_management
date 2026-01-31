package com.hospital.backend.service;

import com.hospital.backend.entity.Prescription;
import java.util.List;
import java.util.Optional;

public interface PrescriptionService {
    Prescription createPrescription(Prescription prescription);

    List<Prescription> getAllPrescriptions();

    Optional<Prescription> getPrescriptionById(int id);

    Prescription updatePrescription(int id, Prescription prescription);

    void deletePrescription(int id);

    List<Prescription> getPrescriptionsByDoctor(int doctorId);

    List<Prescription> getPrescriptionsByPatient(int patientId);

    List<Prescription> getPrescriptionsByAppointment(int appointmentId);

    List<Prescription> getPrescriptionsByDate(String date);

    boolean existsById(int id);

    void sendPrescriptionEmailToPatient(int prescriptionId);
}