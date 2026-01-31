package com.hospital.backend.serviceImpl;

import com.hospital.backend.EmailService;
import com.hospital.backend.entity.Appointment;
import com.hospital.backend.entity.Doctor;
import com.hospital.backend.entity.Patient;
import com.hospital.backend.entity.Specialization;
import com.hospital.backend.repository.AppointmentRepository;
import com.hospital.backend.repository.DoctorRepository;
import com.hospital.backend.repository.PatientRepository;
import com.hospital.backend.repository.SpecializationRepository;
import com.hospital.backend.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private SpecializationRepository specializationRepository;

    @Override
    public Appointment createAppointment(Appointment appointment) {
        // Create the appointment first
        Appointment createdAppointment = appointmentRepository.createAppointment(appointment);

        // Send confirmation email
        try {
            int patientId = createdAppointment.getpId();
            int doctorId = createdAppointment.getDrId();

            Optional<Patient> patientOpt = patientRepository.getPatientById(patientId);
            Optional<Doctor> doctorOpt = doctorRepository.getDoctorById(doctorId);

            if (patientOpt.isPresent() && doctorOpt.isPresent()) {
                Patient patient = patientOpt.get();
                Doctor doctor = doctorOpt.get();

                String patientEmail = patient.getEmail();
                if (patientEmail != null && !patientEmail.isBlank()) {
                    try {
                        // Get specialization name
                        String specializationName = "General";
                        if (doctor.getSpId() != null) {
                            Optional<Specialization> specOpt = specializationRepository
                                    .getSpecializationById(doctor.getSpId());
                            if (specOpt.isPresent()) {
                                specializationName = specOpt.get().getSpName();
                            }
                        }

                        // Prepare appointment details
                        String appointmentDate = createdAppointment.getAppointmentDate() != null
                                ? createdAppointment.getAppointmentDate().toString()
                                : "Not set";
                        String appointmentTime = createdAppointment.getAppointmentTime() != null
                                ? createdAppointment.getAppointmentTime().toString()
                                : "Not set";
                        String description = createdAppointment.getDescript();
                        String appointmentId = String.valueOf(createdAppointment.getApId());

                        // Send HTML email confirmation
                        emailService.sendAppointmentConfirmation(
                                patientEmail,
                                patient.getName(),
                                doctor.getDrName(),
                                specializationName,
                                appointmentDate,
                                appointmentTime,
                                description,
                                appointmentId);

                        System.out.println("Appointment confirmation email sent to: " + patientEmail);
                    } catch (Exception mailEx) {
                        System.err.println("Error sending appointment confirmation email: " + mailEx.getMessage());
                        mailEx.printStackTrace();
                        // Don't fail the appointment creation if email fails
                    }
                }
            }
        } catch (Exception ex) {
            System.err.println("Error in email sending process: " + ex.getMessage());
            ex.printStackTrace();
            // Don't fail the appointment creation if email process fails
        }

        return createdAppointment;
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.getAllAppointments();
    }

    @Override
    public Optional<Appointment> getAppointmentById(int id) {
        return appointmentRepository.getAppointmentById(id);
    }

    @Override
    public Appointment updateAppointment(int id, Appointment appointment) {
        // Fetch the existing appointment
        Appointment existing = appointmentRepository.getAppointmentById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));

        // Determine if provided date or time changed (ignore nulls in payload)
        boolean dateChanged = appointment.getAppointmentDate() != null
                && !appointment.getAppointmentDate().equals(existing.getAppointmentDate());
        boolean timeChanged = appointment.getAppointmentTime() != null
                && !appointment.getAppointmentTime().equals(existing.getAppointmentTime());
        boolean dateOrTimeChanged = dateChanged || timeChanged;

        // If status is Pending and date/time changed, update status and send email
        if (dateOrTimeChanged && "PENDING".equalsIgnoreCase(existing.getStatus())) {
            existing.setStatus("SCHEDULED");
            int patientId = existing.getpId();
            int doctorId = existing.getDrId();

            try {
                Optional<Patient> patientOpt = patientRepository.getPatientById(patientId);
                Optional<Doctor> doctorOpt = doctorRepository.getDoctorById(doctorId);

                if (patientOpt.isPresent() && doctorOpt.isPresent()) {
                    Patient patient = patientOpt.get();
                    Doctor doctor = doctorOpt.get();

                    String patientEmail = patient.getEmail();
                    if (patientEmail != null && !patientEmail.isBlank()) {
                        try {
                            // Get specialization name
                            String specializationName = "General";
                            if (doctor.getSpId() != null) {
                                Optional<Specialization> specOpt = specializationRepository
                                        .getSpecializationById(doctor.getSpId());
                                if (specOpt.isPresent()) {
                                    specializationName = specOpt.get().getSpName();
                                }
                            }

                            // Prepare appointment details
                            String appointmentDate = (appointment.getAppointmentDate() != null
                                    ? appointment.getAppointmentDate()
                                    : existing.getAppointmentDate()).toString();
                            String appointmentTime = (appointment.getAppointmentTime() != null
                                    ? appointment.getAppointmentTime()
                                    : existing.getAppointmentTime()).toString();
                            String description = existing.getDescript();
                            String appointmentId = String.valueOf(existing.getApId());

                            // Send HTML email confirmation
                            emailService.sendAppointmentConfirmation(
                                    patientEmail,
                                    patient.getName(),
                                    doctor.getDrName(),
                                    specializationName,
                                    appointmentDate,
                                    appointmentTime,
                                    description,
                                    appointmentId);
                        } catch (Exception mailEx) {
                            System.err.println("Error sending appointment confirmation email: " + mailEx.getMessage());
                            // Swallow email errors to avoid blocking the update
                        }
                    }
                }
            } catch (Exception ex) {
                System.err.println("Error fetching patient/doctor details: " + ex.getMessage());
                // If patient/doctor not found or any error occurs, continue without email
            }
        }

        // Apply only provided fields; preserve others
        if (appointment.getAppointmentDate() != null) {
            existing.setAppointmentDate(appointment.getAppointmentDate());
        }
        if (appointment.getAppointmentTime() != null) {
            existing.setAppointmentTime(appointment.getAppointmentTime());
        }
        // ... update other fields as needed ...

        // Save and return
        return appointmentRepository.updateAppointment(existing);
    }

    @Override
    public void deleteAppointment(int id) {
        appointmentRepository.deleteAppointment(id);
    }

    @Override
    public List<Appointment> getAppointmentsByDoctor(int doctorId) {
        List<Appointment> appointments = appointmentRepository.getAppointmentsByDoctor(doctorId);

        // Get today's date
        java.sql.Date today = new java.sql.Date(System.currentTimeMillis());

        // Update past appointments to COMPLETED status if they're still PENDING or
        // SCHEDULED
        for (Appointment appointment : appointments) {
            if (appointment.getAppointmentDate() != null &&
                    appointment.getAppointmentDate().before(today)) {

                String currentStatus = appointment.getStatus();
                if ("PENDING".equalsIgnoreCase(currentStatus) ||
                        "SCHEDULED".equalsIgnoreCase(currentStatus)) {

                    // Update status to COMPLETED for past appointments
                    try {
                        appointmentRepository.updateStatus(appointment.getApId(), "COMPLETED");
                        appointment.setStatus("COMPLETED");
                        System.out.println("Auto-updated past appointment " + appointment.getApId() + " to COMPLETED");
                    } catch (Exception e) {
                        System.err.println("Error updating past appointment status: " + e.getMessage());
                    }
                }
            }
        }

        return appointments;
    }

    @Override
    public List<Appointment> getAppointmentsByPatient(int patientId) {
        List<Appointment> appointments = appointmentRepository.getAppointmentsByPatient(patientId);

        // Get today's date
        java.sql.Date today = new java.sql.Date(System.currentTimeMillis());

        // Update past appointments to COMPLETED status if they're still PENDING or
        // SCHEDULED
        for (Appointment appointment : appointments) {
            if (appointment.getAppointmentDate() != null &&
                    appointment.getAppointmentDate().before(today)) {

                String currentStatus = appointment.getStatus();
                if ("PENDING".equalsIgnoreCase(currentStatus) ||
                        "SCHEDULED".equalsIgnoreCase(currentStatus)) {

                    // Update status to COMPLETED for past appointments
                    try {
                        appointmentRepository.updateStatus(appointment.getApId(), "COMPLETED");
                        appointment.setStatus("COMPLETED");
                        System.out.println("Auto-updated past appointment " + appointment.getApId() + " to COMPLETED");
                    } catch (Exception e) {
                        System.err.println("Error updating past appointment status: " + e.getMessage());
                    }
                }
            }
        }

        return appointments;
    }

    @Override
    public List<Appointment> getAppointmentsByStatus(String status) {
        return appointmentRepository.getAppointmentsByStatus(status);
    }

    @Override
    public List<Appointment> getAppointmentsByDate(String date) {
        return appointmentRepository.getAppointmentsByDate(date);
    }

    @Override
    public List<Appointment> getUpcomingAppointments(int doctorId) {
        return appointmentRepository.getUpcomingAppointments(doctorId);
    }

    @Override
    public List<Appointment> getPastAppointments(int doctorId) {
        return appointmentRepository.getPastAppointments(doctorId);
    }

    @Override
    public List<Appointment> getTodayAppointments(int doctorId) {
        return appointmentRepository.getTodayAppointments(doctorId);
    }

    @Override
    public Appointment updateStatus(int id, String status) {
        return appointmentRepository.updateStatus(id, status);
    }

    @Override
    public List<Appointment> getAppointmentsByDoctorAndDate(int doctorId, String date) {
        return appointmentRepository.getAppointmentsByDoctorAndDate(doctorId, date);
    }

}