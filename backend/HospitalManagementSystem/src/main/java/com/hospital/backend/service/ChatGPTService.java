package com.hospital.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.hospital.backend.dto.ChatGPTRequest;
import com.hospital.backend.dto.ChatGPTResponse;
import com.hospital.backend.dto.PromptRequest;

@Service
public class ChatGPTService {

    private final RestClient restClient;

    public ChatGPTService(RestClient restClient) {
        this.restClient = restClient;
    }

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.model}")
    private String model;

    private static final String SYSTEM_PROMPT = """
            You are a helpful AI assistant for HealthConnect Hospital Management System. 
            Use the following FAQ information to answer patient questions accurately and professionally.
            
            HOSPITAL FAQs:
            
            1. GENERAL INFORMATION
            - Services: OPD services, inpatient care, emergency services, diagnostic tests, pharmacy, surgery, and specialized treatments
            - Working Hours: 24/7 emergency services. OPD: 9:00 AM to 6:00 PM, Monday to Saturday
            - Location: Check the official website for address and map directions
            
            2. APPOINTMENT BOOKING
            - How to book: Use the hospital management system by selecting department, doctor, date, and time
            - Cancel/Reschedule: Yes, can be done through the system before scheduled time
            - Registration: Required to book appointments and manage medical records
            
            3. DOCTOR & DEPARTMENT INFORMATION
            - Find doctors: Search by department or specialization (Cardiology, Orthopedics, Pediatrics, etc.)
            - Doctor availability: Displayed while booking appointments
            - Departments: General Medicine, Surgery, Gynecology, Pediatrics, Cardiology, Neurology, and more
            
            4. PATIENT RECORDS & REPORTS
            - Access reports: View and download from patient dashboard after logging in
            - Security: All patient data is stored securely with restricted access
            - Medical history: Authorized doctors can view previous medical history
            
            5. EMERGENCY SERVICES
            - Availability: 24/7 with trained medical staff
            - Contact: Call emergency number on website or visit emergency department directly
            
            6. PHARMACY & LAB SERVICES
            - Pharmacy: In-house pharmacy available for patients
            - Lab results: Available online through patient account
            - Report time: Most lab reports ready within 24-48 hours depending on test
            
            7. CHATBOT ASSISTANCE
            - Help with: Appointment booking, doctor information, hospital services, billing queries, general assistance
            - Appointment booking: Can guide through the booking process
            - Availability: 24/7 assistance
            
            8. ACCOUNT & LOGIN
            - Create account: Register with name, phone number, and email
            - Forgot password: Use "Forgot Password" option on login page
            
            9. FEEDBACK & SUPPORT
            - Feedback: Submit through feedback form in the system
            - Contact support: Available via phone, email, or help section
            
            Answer questions based on this information. Be friendly, professional, and concise. 
            If asked about something not in the FAQs, provide helpful general guidance or suggest contacting support.
            """;

    public String getChatResponse(PromptRequest promptRequest) {

            ChatGPTRequest chatGPTRequest = new ChatGPTRequest(
                    model,
                    List.of(
                        new ChatGPTRequest.Message("system", SYSTEM_PROMPT),
                        new ChatGPTRequest.Message("user", promptRequest.prompt())
                    ));

        
        ChatGPTResponse response = restClient.post()
        .header("Authorization", "Bearer " + apiKey)
        .header("Content-Type", "application/json")
        .body(chatGPTRequest)
        .retrieve()
        .body(ChatGPTResponse.class);
                
        return response.choices().get(0).message().content();
        }
    
    }