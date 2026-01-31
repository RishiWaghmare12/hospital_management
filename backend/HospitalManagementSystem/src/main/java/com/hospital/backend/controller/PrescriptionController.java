package com.hospital.backend.controller;

import com.hospital.backend.entity.Prescription;
import com.hospital.backend.dto.PrescriptionDTO;
import com.hospital.backend.service.PrescriptionService;
import com.hospital.backend.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping
    public List<PrescriptionDTO> getAllPrescriptions() {
        return enrichPrescriptions(prescriptionService.getAllPrescriptions());
    }

    @GetMapping("/{id}")
    public PrescriptionDTO getPrescriptionById(@PathVariable int id) {
        Prescription prescription = prescriptionService.getPrescriptionById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
        return enrichPrescription(prescription);
    }

    @PostMapping
    public Prescription createPrescription(@RequestBody Prescription prescription) {
        return prescriptionService.createPrescription(prescription);
    }

    @PutMapping("/{id}")
    public Prescription updatePrescription(@PathVariable int id, @RequestBody Prescription prescription) {
        return prescriptionService.updatePrescription(id, prescription);
    }

    @DeleteMapping("/{id}")
    public void deletePrescription(@PathVariable int id) {
        prescriptionService.deletePrescription(id);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<PrescriptionDTO> getPrescriptionsByDoctor(@PathVariable int doctorId) {
        return enrichPrescriptions(prescriptionService.getPrescriptionsByDoctor(doctorId));
    }

    @GetMapping("/patient/{patientId}")
    public List<PrescriptionDTO> getPrescriptionsByPatient(@PathVariable int patientId) {
        return enrichPrescriptions(prescriptionService.getPrescriptionsByPatient(patientId));
    }

    @GetMapping("/appointment/{appointmentId}")
    public List<PrescriptionDTO> getPrescriptionsByAppointment(@PathVariable int appointmentId) {
        return enrichPrescriptions(prescriptionService.getPrescriptionsByAppointment(appointmentId));
    }

    @GetMapping("/date/{date}")
    public List<PrescriptionDTO> getPrescriptionsByDate(@PathVariable String date) {
        return enrichPrescriptions(prescriptionService.getPrescriptionsByDate(date));
    }

    @PostMapping("/{id}/send-email")
    public String sendPrescriptionEmail(@PathVariable int id) {
        try {
            prescriptionService.sendPrescriptionEmailToPatient(id);
            return "Prescription email sent successfully";
        } catch (Exception e) {
            throw new RuntimeException("Failed to send prescription email: " + e.getMessage());
        }
    }

    // Helper method to enrich a single prescription with appointment data
    private PrescriptionDTO enrichPrescription(Prescription prescription) {
        if (prescription.getApId() != null) {
            return appointmentRepository.getAppointmentById(prescription.getApId())
                    .map(appointment -> new PrescriptionDTO(prescription, appointment))
                    .orElse(new PrescriptionDTO(prescription));
        }
        return new PrescriptionDTO(prescription);
    }

    // Helper method to enrich a list of prescriptions
    private List<PrescriptionDTO> enrichPrescriptions(List<Prescription> prescriptions) {
        return prescriptions.stream()
                .map(this::enrichPrescription)
                .collect(Collectors.toList());
    }
}
