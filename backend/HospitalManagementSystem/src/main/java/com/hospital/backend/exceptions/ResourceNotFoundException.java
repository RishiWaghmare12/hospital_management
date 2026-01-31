package com.hospital.backend.exceptions;

public class ResourceNotFoundException extends HospitalException {
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super("NOT_FOUND", String.format("%s not found with %s : '%s'", resourceName, fieldName, fieldValue));
    }
} 