package com.hospital.backend.entity;

public class Admin {
    private int Ad_ID;
    private String Name;
    private String Email;
    private String Password;

    // Default constructor
    public Admin() {}

    // Getters and Setters
    public int getAd_ID() {
        return Ad_ID;
    }

    public void setAd_ID(int Ad_ID) {
        this.Ad_ID = Ad_ID;
    }

    public String getName() {
        return Name;
    }

    public void setName(String Name) {
        this.Name = Name;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String Email) {
        this.Email = Email;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String Password) {
        this.Password = Password;
    }
}