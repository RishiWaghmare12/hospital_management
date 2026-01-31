package com.hospital.backend.exceptions;

import java.util.List;

public class ValidationException extends HospitalException {
    private List<String> errors;

    public ValidationException(String errorCode, String errorMessage, List<String> errors) {
        super(errorCode, errorMessage);
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
} 