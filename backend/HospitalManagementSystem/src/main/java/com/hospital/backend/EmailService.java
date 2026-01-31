package com.hospital.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendAppointmentConfirmation(String toEmail, String patientName, String doctorName,
            String specialization, String appointmentDate, String appointmentTime,
            String description, String appointmentId) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("🏥 Appointment Confirmation - " + doctorName);

            String htmlContent = "<!DOCTYPE html>" +
                    "<html>" +
                    "<head>" +
                    "<meta charset=\"UTF-8\">" +
                    "<style>" +
                    "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                    ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                    ".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }"
                    +
                    ".content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }" +
                    ".details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }"
                    +
                    ".detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }"
                    +
                    ".label { font-weight: bold; color: #555; }" +
                    ".value { color: #333; text-align: right; }" +
                    ".appointment-info { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; }" +
                    ".footer { text-align: center; margin-top: 30px; color: #666; }" +
                    ".success-icon { font-size: 48px; margin-bottom: 10px; }" +
                    ".status-badge { background: #4caf50; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; font-size: 14px; }"
                    +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<div class=\"container\">" +
                    "<div class=\"header\">" +
                    "<div class=\"success-icon\">✅</div>" +
                    "<h1>Appointment Confirmed!</h1>" +
                    "<p>Your appointment has been successfully scheduled</p>" +
                    "</div>" +
                    "<div class=\"content\">" +
                    "<h2>Hello " + patientName + ",</h2>" +
                    "<p>Your appointment with <strong>Dr. " + doctorName + "</strong> has been confirmed!</p>" +

                    "<div class=\"details\">" +
                    "<h3>📋 Appointment Details</h3>" +
                    "<div class=\"detail-row\">" +
                    "<span class=\"label\">Appointment ID:</span>" +
                    "<span class=\"value\">#" + appointmentId + "</span>" +
                    "</div>" +
                    "<div class=\"detail-row\">" +
                    "<span class=\"label\">Doctor:</span>" +
                    "<span class=\"value\">Dr. " + doctorName + "</span>" +
                    "</div>" +
                    "<div class=\"detail-row\">" +
                    "<span class=\"label\">Specialization:</span>" +
                    "<span class=\"value\">" + (specialization != null ? specialization : "General") + "</span>" +
                    "</div>" +
                    "<div class=\"detail-row\">" +
                    "<span class=\"label\">Date:</span>" +
                    "<span class=\"value\">" + appointmentDate + "</span>" +
                    "</div>" +
                    "<div class=\"detail-row\">" +
                    "<span class=\"label\">Time:</span>" +
                    "<span class=\"value\">" + appointmentTime + "</span>" +
                    "</div>" +
                    (description != null && !description.isEmpty() ? "<div class=\"detail-row\">" +
                            "<span class=\"label\">Description:</span>" +
                            "<span class=\"value\">" + description + "</span>" +
                            "</div>" : "")
                    +
                    "</div>" +

                    "<div class=\"appointment-info\">" +
                    "<h3>📌 Important Information</h3>" +
                    "<p><strong>Status:</strong> <span class=\"status-badge\">CONFIRMED</span></p>" +
                    "<p>✓ Please arrive 10 minutes before your scheduled time</p>" +
                    "<p>✓ Bring any relevant medical records or test results</p>" +
                    "<p>✓ If you need to cancel or reschedule, please contact us at least 24 hours in advance</p>" +
                    "</div>" +

                    "<p><strong>Please keep this email for your records.</strong></p>" +
                    "<p>We look forward to seeing you at your appointment!</p>" +
                    "</div>" +
                    "<div class=\"footer\">" +
                    "<p>Thank you for choosing our Hospital Management System!</p>" +
                    "<p>If you have any questions, please contact us.</p>" +
                    "</div>" +
                    "</div>" +
                    "</body>" +
                    "</html>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Error sending HTML email: " + e.getMessage());
            // Fallback to simple text email
            SimpleMailMessage fallbackMessage = new SimpleMailMessage();
            fallbackMessage.setTo(toEmail);
            fallbackMessage.setSubject("Appointment Confirmation - Dr. " + doctorName);
            fallbackMessage.setText("Hello " + patientName + ",\n\n" +
                    "Your appointment has been confirmed!\n\n" +
                    "Details:\n" +
                    "Appointment ID: #" + appointmentId + "\n" +
                    "Doctor: Dr. " + doctorName + "\n" +
                    "Specialization: " + (specialization != null ? specialization : "General") + "\n" +
                    "Date: " + appointmentDate + "\n" +
                    "Time: " + appointmentTime + "\n" +
                    (description != null && !description.isEmpty() ? "Description: " + description + "\n" : "") +
                    "\nPlease arrive 10 minutes before your scheduled time.\n" +
                    "Bring any relevant medical records or test results.\n\n" +
                    "Thank you for choosing our Hospital Management System!\n" +
                    "Hospital Management Team");
            mailSender.send(fallbackMessage);
        }
    }

    public void sendPrescriptionEmail(String toEmail, String patientName, String doctorName,
            String specialization, String medicine, String advice, String remark,
            String prescriptionId, String dateIssued) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("💊 Your Prescription from Dr. " + doctorName);

            String htmlContent = "<!DOCTYPE html>" +
                    "<html>" +
                    "<head>" +
                    "<meta charset=\"UTF-8\">" +
                    "<style>" +
                    "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                    ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                    ".header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }"
                    +
                    ".content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }" +
                    ".details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981; }"
                    +
                    ".detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }"
                    +
                    ".label { font-weight: bold; color: #555; }" +
                    ".value { color: #333; text-align: right; }" +
                    ".prescription-section { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }"
                    +
                    ".medicine-box { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; border: 2px solid #10b981; }"
                    +
                    ".advice-box { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #3b82f6; }"
                    +
                    ".remark-box { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #f59e0b; }"
                    +
                    ".footer { text-align: center; margin-top: 30px; color: #666; }" +
                    ".success-icon { font-size: 48px; margin-bottom: 10px; }" +
                    ".status-badge { background: #10b981; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; font-size: 14px; }"
                    +
                    ".warning { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }"
                    +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<div class=\"container\">" +
                    "<div class=\"header\">" +
                    "<div class=\"success-icon\">💊</div>" +
                    "<h1>Your Prescription</h1>" +
                    "<p>Medical prescription from Dr. " + doctorName + "</p>" +
                    "</div>" +
                    "<div class=\"content\">" +
                    "<h2>Hello " + patientName + ",</h2>" +
                    "<p>Your prescription has been issued by <strong>Dr. " + doctorName + "</strong>.</p>" +

                    "<div class=\"details\">" +
                    "<h3>📋 Prescription Details</h3>" +
                    "<div class=\"detail-row\">" +
                    "<span class=\"label\">Prescription ID:</span>" +
                    "<span class=\"value\">#" + prescriptionId + "</span>" +
                    "</div>" +
                    "<div class=\"detail-row\">" +
                    "<span class=\"label\">Doctor:</span>" +
                    "<span class=\"value\">Dr. " + doctorName + "</span>" +
                    "</div>" +
                    "<div class=\"detail-row\">" +
                    "<span class=\"label\">Specialization:</span>" +
                    "<span class=\"value\">" + (specialization != null ? specialization : "General") + "</span>" +
                    "</div>" +
                    "<div class=\"detail-row\">" +
                    "<span class=\"label\">Date Issued:</span>" +
                    "<span class=\"value\">" + dateIssued + "</span>" +
                    "</div>" +
                    "</div>" +

                    "<div class=\"prescription-section\">" +
                    "<h3>💊 Medicine Prescribed</h3>" +
                    "<div class=\"medicine-box\">" +
                    "<p style=\"margin: 0; font-size: 16px; font-weight: bold; color: #10b981;\">" + medicine + "</p>" +
                    "</div>" +
                    "</div>" +

                    "<div class=\"prescription-section\">" +
                    "<h3>📝 Instructions & Advice</h3>" +
                    "<div class=\"advice-box\">" +
                    "<p style=\"margin: 0;\">" + advice + "</p>" +
                    "</div>" +
                    "</div>" +

                    (remark != null && !remark.isEmpty() ? "<div class=\"prescription-section\">" +
                            "<h3>⚠️ Additional Remarks</h3>" +
                            "<div class=\"remark-box\">" +
                            "<p style=\"margin: 0; font-style: italic;\">" + remark + "</p>" +
                            "</div>" +
                            "</div>" : "")
                    +

                    "<div class=\"warning\">" +
                    "<h3>⚕️ Important Information</h3>" +
                    "<p><strong>Status:</strong> <span class=\"status-badge\">ACTIVE</span></p>" +
                    "<p>✓ Follow the prescribed dosage and instructions carefully</p>" +
                    "<p>✓ Complete the full course of medication as advised</p>" +
                    "<p>✓ Contact your doctor if you experience any side effects</p>" +
                    "<p>✓ Do not share this medication with others</p>" +
                    "<p>✓ Store medication as per instructions</p>" +
                    "</div>" +

                    "<p><strong>Please keep this email for your medical records.</strong></p>" +
                    "<p>If you have any questions about this prescription, please contact your doctor.</p>" +
                    "</div>" +
                    "<div class=\"footer\">" +
                    "<p>Thank you for choosing our Hospital Management System!</p>" +
                    "<p>This is an automated email. Please do not reply to this message.</p>" +
                    "</div>" +
                    "</div>" +
                    "</body>" +
                    "</html>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Error sending prescription email: " + e.getMessage());
            // Fallback to simple text email
            SimpleMailMessage fallbackMessage = new SimpleMailMessage();
            fallbackMessage.setTo(toEmail);
            fallbackMessage.setSubject("Your Prescription from Dr. " + doctorName);
            fallbackMessage.setText("Hello " + patientName + ",\n\n" +
                    "Your prescription has been issued!\n\n" +
                    "Details:\n" +
                    "Prescription ID: #" + prescriptionId + "\n" +
                    "Doctor: Dr. " + doctorName + "\n" +
                    "Specialization: " + (specialization != null ? specialization : "General") + "\n" +
                    "Date Issued: " + dateIssued + "\n\n" +
                    "Medicine: " + medicine + "\n\n" +
                    "Instructions: " + advice + "\n" +
                    (remark != null && !remark.isEmpty() ? "\nRemarks: " + remark + "\n" : "") +
                    "\nPlease follow the prescribed dosage and instructions carefully.\n" +
                    "Contact your doctor if you experience any side effects.\n\n" +
                    "Thank you for choosing our Hospital Management System!\n" +
                    "Hospital Management Team");
            mailSender.send(fallbackMessage);
        }
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("🔑 Password Reset Request");

            String htmlContent = "<!DOCTYPE html>" +
                    "<html>" +
                    "<head>" +
                    "<meta charset=\"UTF-8\">" +
                    "<style>" +
                    "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                    ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                    ".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }"
                    +
                    ".content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }" +
                    ".token-box { background: #white; border: 2px dashed #667eea; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; letter-spacing: 5px; }"
                    +
                    ".footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<div class=\"container\">" +
                    "<div class=\"header\">" +
                    "<h1>Password Reset</h1>" +
                    "</div>" +
                    "<div class=\"content\">" +
                    "<p>Hello,</p>" +
                    "<p>We received a request to reset your password. Use the token below to complete the process:</p>"
                    +
                    "<div class=\"token-box\">" + token + "</div>" +
                    "<p>This token will expire in 15 minutes.</p>" +
                    "<p>If you didn't request this, you can safely ignore this email.</p>" +
                    "</div>" +
                    "<div class=\"footer\">" +
                    "<p>Hospital Management System</p>" +
                    "</div>" +
                    "</div>" +
                    "</body>" +
                    "</html>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Error sending password reset email: " + e.getMessage());
            // Fallback to simple text email
            SimpleMailMessage fallbackMessage = new SimpleMailMessage();
            fallbackMessage.setTo(toEmail);
            fallbackMessage.setSubject("Password Reset Request");
            fallbackMessage.setText("Your password reset token is: " + token + "\n\nThis token expires in 15 minutes.");
            mailSender.send(fallbackMessage);
        }
    }
}
