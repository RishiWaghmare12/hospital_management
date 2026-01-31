package com.hospital.backend.exceptions;

public class BusinessRuleException extends HospitalException {
    public BusinessRuleException(String errorMessage) {
        super("BUSINESS_RULE_VIOLATION", errorMessage);
    }
} 