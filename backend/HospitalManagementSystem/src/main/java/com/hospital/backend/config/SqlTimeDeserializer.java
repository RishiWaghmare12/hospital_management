package com.hospital.backend.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.sql.Time;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class SqlTimeDeserializer extends JsonDeserializer<Time> {

    @Override
    public Time deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String timeString = p.getText();

        if (timeString == null || timeString.isEmpty()) {
            return null;
        }

        try {
            // Try parsing with seconds (HH:mm:ss)
            LocalTime localTime = LocalTime.parse(timeString, DateTimeFormatter.ofPattern("HH:mm:ss"));
            return Time.valueOf(localTime);
        } catch (Exception e1) {
            try {
                // Try parsing without seconds (HH:mm)
                LocalTime localTime = LocalTime.parse(timeString, DateTimeFormatter.ofPattern("HH:mm"));
                return Time.valueOf(localTime);
            } catch (Exception e2) {
                throw new IOException("Unable to parse time: " + timeString +
                        ". Expected format: HH:mm:ss or HH:mm", e2);
            }
        }
    }
}
