package com.hospital.backend.serviceImpl;

import com.hospital.backend.entity.Prescription;
import com.hospital.backend.entity.Appointment;
import com.hospital.backend.entity.Patient;
import com.hospital.backend.entity.Doctor;
import com.hospital.backend.repository.AppointmentRepository;
import com.hospital.backend.repository.PrescriptionRepository;
import com.hospital.backend.repository.PatientRepository;
import com.hospital.backend.repository.DoctorRepository;
import com.hospital.backend.service.PrescriptionService;
import com.hospital.backend.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public Prescription createPrescription(Prescription prescription) {
        // Ensure required fields are present; infer patient from appointment when
        // possible
        Integer currentPid = prescription.getpId();
        if (currentPid == null || currentPid == 0) {
            // Try to derive patient ID from appointment
            Integer apId = prescription.getApId();
            if (apId != null) {
                appointmentRepository.getAppointmentById(apId)
                        .ifPresent(appt -> prescription.setpId(appt.getpId()));
            }
        }

        currentPid = prescription.getpId();
        if (currentPid == null || currentPid == 0) {
            throw new IllegalArgumentException("Patient ID (pId) is required or resolvable from appointment");
        }

        return prescriptionRepository.createPrescription(prescription);
    }

    @Override
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.getAllPrescriptions();
    }

    @Override
    public Optional<Prescription> getPrescriptionById(int id) {
        return prescriptionRepository.getPrescriptionById(id);
    }

    @Override
    public Prescription updatePrescription(int id, Prescription prescription) {
        if (prescriptionRepository.existsById(id)) {
            prescription.setPrId(id);
            return prescriptionRepository.createPrescription(prescription);
        }
        throw new RuntimeException("Prescription not found with id: " + id);
    }

    @Override
    public void deletePrescription(int id) {

        prescriptionRepository.deletePrescription(id);
    }

    @Override
    public List<Prescription> getPrescriptionsByDoctor(int doctorId) {
        return prescriptionRepository.getPrescriptionsByDoctor(doctorId);
    }

    @Override
    public List<Prescription> getPrescriptionsByPatient(int patientId) {
        return prescriptionRepository.getPrescriptionsByPatient(patientId);
    }

    @Override
    public List<Prescription> getPrescriptionsByAppointment(int appointmentId) {
        return prescriptionRepository.getPrescriptionsByAppointment(appointmentId);
    }

    @Override
    public List<Prescription> getPrescriptionsByDate(String date) {
        return prescriptionRepository.getPrescriptionsByDate(date);
    }

    @Override
    public boolean existsById(int id) {
        return prescriptionRepository.existsById(id);
    }

    @Override
    public void sendPrescriptionEmailToPatient(int prescriptionId) {
        try {
            // Fetch prescription
            Optional<Prescription> prescriptionOpt = prescriptionRepository.getPrescriptionById(prescriptionId);
            if (!prescriptionOpt.isPresent()) {
                throw new RuntimeException("Prescription not found with id: " + prescriptionId);
            }
            Prescription prescription = prescriptionOpt.get();

            // Fetch patient details
            Optional<Patient> patientOpt = patientRepository.getPatientById(prescription.getpId());
            if (!patientOpt.isPresent()) {
                throw new RuntimeException("Patient not found with id: " + prescription.getpId());
            }
            Patient patient = patientOpt.get();

            // Check if patient has email
            if (patient.getEmail() == null || patient.getEmail().isEmpty()) {
                throw new RuntimeException("Patient does not have an email address");
            }

            // Fetch doctor details from appointment
            String doctorName = "Unknown Doctor";
            String specialization = "General";

            if (prescription.getApId() != null) {
                Optional<Appointment> appointmentOpt = appointmentRepository.getAppointmentById(prescription.getApId());
                if (appointmentOpt.isPresent()) {
                    Appointment appointment = appointmentOpt.get();
                    Optional<Doctor> doctorOpt = doctorRepository.getDoctorById(appointment.getDrId());
                    if (doctorOpt.isPresent()) {
                        Doctor doctor = doctorOpt.get();
                        doctorName = doctor.getDrName();
                        // You can fetch specialization from SpecializationRepository if needed
                        // For now, we'll use a default or fetch it separately
                    }
                }
            }

            // Format date
            String dateIssued = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));

            // Send email
            emailService.sendPrescriptionEmail(
                    patient.getEmail(),
                    patient.getName(),
                    doctorName,
                    specialization,
                    prescription.getMedicine(),
                    prescription.getAdvice(),
                    prescription.getRemark(),
                    String.valueOf(prescription.getPrId()),
                    dateIssued);

            System.out.println("Prescription email sent successfully to: " + patient.getEmail());
        } catch (Exception e) {
            System.err.println("Error sending prescription email: " + e.getMessage());
            throw new RuntimeException("Failed to send prescription email: " + e.getMessage());
        }
    }
}