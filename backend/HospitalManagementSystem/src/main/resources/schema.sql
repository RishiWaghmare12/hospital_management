-- Schema DDL for Hospital Management System (JDBC Template based)
-- Uses CREATE TABLE IF NOT EXISTS to avoid errors on re-run.
-- NOTE: Adjust VARCHAR lengths or add constraints as needed.

CREATE TABLE IF NOT EXISTS speclization (
    Sp_Id INT AUTO_INCREMENT PRIMARY KEY,
    Sp_Name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS admin (
    Ad_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    UNIQUE KEY uk_admin_email (Email)
);

CREATE TABLE IF NOT EXISTS patient (
    P_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    DOB DATE NULL,
    Age INT NULL,
    Gender VARCHAR(10) NULL,
    Blood_Group VARCHAR(10) NULL,
    Mobile_No VARCHAR(20) NULL,
    Email VARCHAR(150) NULL,
    Address VARCHAR(255) NULL,
    Password VARCHAR(255) NULL,
    reset_token VARCHAR(255) NULL,
    reset_token_expiry TIMESTAMP NULL,
    UNIQUE KEY uk_patient_email (Email)
);

CREATE TABLE IF NOT EXISTS doctor (
    DR_ID INT AUTO_INCREMENT PRIMARY KEY,
    Dr_name VARCHAR(100) NOT NULL,
    Mobile_no VARCHAR(20) NULL,
    Email_id VARCHAR(150) NULL,
    Gender VARCHAR(10) NULL,
    Age INT NULL,
    Experience INT NULL,
    Password VARCHAR(255) NULL,
    Sp_Id INT NULL,
    picture VARCHAR(255) NULL,
    UNIQUE KEY uk_doctor_email (Email_id),
    CONSTRAINT fk_doctor_specialization FOREIGN KEY (Sp_Id) REFERENCES speclization(Sp_Id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS appointment (
    Ap_ID INT AUTO_INCREMENT PRIMARY KEY,
    P_ID INT NOT NULL,
    DR_ID INT NOT NULL,
    Descript VARCHAR(255) NULL,
    cancel_confirm INT NULL,
    appointment_date DATE NULL,
    appointment_time TIME NULL,
    status VARCHAR(30) NULL,
    CONSTRAINT fk_appt_patient FOREIGN KEY (P_ID) REFERENCES patient(P_ID)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_appt_doctor FOREIGN KEY (DR_ID) REFERENCES doctor(DR_ID)
        ON UPDATE CASCADE ON DELETE CASCADE,
    INDEX idx_appt_doctor (DR_ID),
    INDEX idx_appt_patient (P_ID),
    INDEX idx_appt_date (appointment_date)
);

CREATE TABLE IF NOT EXISTS prescription (
    Pr_ID INT AUTO_INCREMENT PRIMARY KEY,
    Ap_Id INT NULL,
    P_ID INT NOT NULL,
    medicine VARCHAR(255) NULL,
    advice VARCHAR(255) NULL,
    remark VARCHAR(255) NULL,
    CONSTRAINT fk_rx_appointment FOREIGN KEY (Ap_Id) REFERENCES appointment(Ap_ID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_rx_patient FOREIGN KEY (P_ID) REFERENCES patient(P_ID)
        ON UPDATE CASCADE ON DELETE CASCADE,
    INDEX idx_rx_patient (P_ID),
    INDEX idx_rx_appointment (Ap_Id)
);

-- Optional additional indexes (uncomment if needed for lookups)
-- CREATE INDEX idx_patient_name ON patient(Name);
-- CREATE INDEX idx_doctor_name ON doctor(Dr_name);

-- Seed a default admin (idempotent)
INSERT INTO admin (Name, Email, Password)
VALUES ('Admin', 'admin@hospital.com', 'admin123')
ON DUPLICATE KEY UPDATE Email = Email;

-- Seed common specializations idempotently so UIs have data
INSERT INTO speclization (Sp_Name)
SELECT 'Cardiology' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM speclization WHERE Sp_Name = 'Cardiology');
INSERT INTO speclization (Sp_Name)
SELECT 'Dermatology' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM speclization WHERE Sp_Name = 'Dermatology');
INSERT INTO speclization (Sp_Name)
SELECT 'Neurology' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM speclization WHERE Sp_Name = 'Neurology');
INSERT INTO speclization (Sp_Name)
SELECT 'Orthopedics' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM speclization WHERE Sp_Name = 'Orthopedics');
INSERT INTO speclization (Sp_Name)
SELECT 'Pediatrics' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM speclization WHERE Sp_Name = 'Pediatrics');
INSERT INTO speclization (Sp_Name)
SELECT 'Oncology' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM speclization WHERE Sp_Name = 'Oncology');
INSERT INTO speclization (Sp_Name)
SELECT 'Gynecology' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM speclization WHERE Sp_Name = 'Gynecology');
