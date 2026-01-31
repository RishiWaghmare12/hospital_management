package com.hospital.backend.entity;

import java.sql.Date;
import java.sql.Time;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.hospital.backend.config.SqlDateDeserializer;
import com.hospital.backend.config.SqlTimeDeserializer;

public class Appointment {
	private int apId;

	@JsonProperty("pId")
	private Integer pId;

	@JsonProperty("drId")
	private Integer drId;

	private String descript;
	private Integer cancelConfirm;

	@JsonDeserialize(using = SqlDateDeserializer.class)
	private Date appointmentDate;

	@JsonDeserialize(using = SqlTimeDeserializer.class)
	private Time appointmentTime;

	private String status;

	public int getApId() {
		return apId;
	}

	public void setApId(int apId) {
		this.apId = apId;
	}

	public Integer getpId() {
		return pId;
	}

	public void setpId(Integer pId) {
		this.pId = pId;
	}

	public Integer getDrId() {
		return drId;
	}

	public void setDrId(Integer drId) {
		this.drId = drId;
	}

	public String getDescript() {
		return descript;
	}

	public void setDescript(String descript) {
		this.descript = descript;
	}

	public Integer getCancelConfirm() {
		return cancelConfirm;
	}

	public void setCancelConfirm(Integer cancelConfirm) {
		this.cancelConfirm = cancelConfirm;
	}

	public Date getAppointmentDate() {
		return appointmentDate;
	}

	public void setAppointmentDate(Date appointmentDate) {
		this.appointmentDate = appointmentDate;
	}

	public Time getAppointmentTime() {
		return appointmentTime;
	}

	public void setAppointmentTime(Time appointmentTime) {
		this.appointmentTime = appointmentTime;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	// Default constructor
	public Appointment() {
		this.cancelConfirm = 0;
		this.status = "PENDING";
	}
}