package com.hospital.backend.entity;

import java.time.LocalDate;

public class Patient {

    private int pId;
    private String name;
    private LocalDate dob;
    private Integer age;
    private String gender;
    private String bloodGroup;
    private String mobileNo;
    private String email;
    private String address;
    private String password;
    private String resetToken;
    private java.time.LocalDateTime resetTokenExpiryDate;

    // Constructors
    public Patient() {
    }

    public Patient(int pId, String name, LocalDate dob, Integer age, String gender,
                   String bloodGroup, String mobileNo, String email, String address, String password) {
        this.pId = pId;
        this.name = name;
        this.dob = dob;
        this.age = age;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.mobileNo = mobileNo;
        this.email = email;
        this.address = address;
        this.password = password;
    }

    // Getters and Setters

    public int getpId() {
        return pId;
    }

    public void setpId(int pId) {
        this.pId = pId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getMobileNo() {
        return mobileNo;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public java.time.LocalDateTime getResetTokenExpiryDate() {
        return resetTokenExpiryDate;
    }

    public void setResetTokenExpiryDate(java.time.LocalDateTime resetTokenExpiryDate) {
        this.resetTokenExpiryDate = resetTokenExpiryDate;
    }
}
