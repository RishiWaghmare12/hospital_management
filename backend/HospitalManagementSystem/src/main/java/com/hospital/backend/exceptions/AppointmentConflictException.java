package com.hospital.backend.exceptions;

public class AppointmentConflictException extends HospitalException {
    public AppointmentConflictException(String errorMessage) {
        super("APPOINTMENT_CONFLICT", errorMessage);
    }
} 