package com.hospital.backend.exceptions;

public class HospitalException extends RuntimeException {
    private String errorCode;
    private String errorMessage;

    public HospitalException(String errorCode, String errorMessage) {
        super(errorMessage);
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }


	public String getErrorCode() {
        return errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }
} 