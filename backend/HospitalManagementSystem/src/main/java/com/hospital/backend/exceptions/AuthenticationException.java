package com.hospital.backend.exceptions;

public class AuthenticationException extends HospitalException {
    public AuthenticationException(String errorMessage) {
        super("AUTHENTICATION_ERROR", errorMessage);
    }
} 