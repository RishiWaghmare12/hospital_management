package com.hospital.backend.service;

import com.hospital.backend.entity.Appointment;
import com.hospital.backend.entity.Doctor;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;

public interface AppointmentService {
    Appointment createAppointment(Appointment appointment);

    List<Appointment> getAllAppointments();

    Optional<Appointment> getAppointmentById(int id);

    Appointment updateAppointment(int id, Appointment appointment);

    void deleteAppointment(int id);

    List<Appointment> getAppointmentsByDoctor(int doctorId);

    List<Appointment> getAppointmentsByPatient(int patientId);

    List<Appointment> getAppointmentsByStatus(String status);

    List<Appointment> getAppointmentsByDate(String date);

    Appointment updateStatus(int id, String status);

    List<Appointment> getUpcomingAppointments(int doctorId);

    List<Appointment> getPastAppointments(int doctorId);

    List<Appointment> getTodayAppointments(int doctorId);

    List<Appointment> getAppointmentsByDoctorAndDate(int doctorId, String date);

}