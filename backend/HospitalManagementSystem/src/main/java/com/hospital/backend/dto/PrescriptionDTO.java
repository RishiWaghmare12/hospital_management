package com.hospital.backend.dto;

import com.hospital.backend.entity.Prescription;
import com.hospital.backend.entity.Appointment;

import java.sql.Date;

/**
 * Data Transfer Object for Prescription with enriched data from Appointment
 * Includes doctor ID and appointment date for frontend display
 */
public class PrescriptionDTO {
    private int prId;
    private Integer apId;
    private int pId;
    private String medicine;
    private String advice;
    private String remark;

    // Enriched fields from Appointment
    private Integer drId; // Doctor ID from appointment
    private Date appointmentDate; // Date from appointment

    // Default constructor
    public PrescriptionDTO() {
    }

    // Constructor from Prescription entity
    public PrescriptionDTO(Prescription prescription) {
        this.prId = prescription.getPrId();
        this.apId = prescription.getApId();
        this.pId = prescription.getpId();
        this.medicine = prescription.getMedicine();
        this.advice = prescription.getAdvice();
        this.remark = prescription.getRemark();
    }

    // Constructor from Prescription and Appointment
    public PrescriptionDTO(Prescription prescription, Appointment appointment) {
        this(prescription);
        if (appointment != null) {
            this.drId = appointment.getDrId();
            this.appointmentDate = appointment.getAppointmentDate();
        }
    }

    // Getters and Setters
    public int getPrId() {
        return prId;
    }

    public void setPrId(int prId) {
        this.prId = prId;
    }

    public Integer getApId() {
        return apId;
    }

    public void setApId(Integer apId) {
        this.apId = apId;
    }

    public int getpId() {
        return pId;
    }

    public void setpId(int pId) {
        this.pId = pId;
    }

    public String getMedicine() {
        return medicine;
    }

    public void setMedicine(String medicine) {
        this.medicine = medicine;
    }

    public String getAdvice() {
        return advice;
    }

    public void setAdvice(String advice) {
        this.advice = advice;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Integer getDrId() {
        return drId;
    }

    public void setDrId(Integer drId) {
        this.drId = drId;
    }

    public Date getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(Date appointmentDate) {
        this.appointmentDate = appointmentDate;
    }
}
