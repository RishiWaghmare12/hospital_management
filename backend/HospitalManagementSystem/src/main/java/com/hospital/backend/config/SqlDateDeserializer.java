package com.hospital.backend.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class SqlDateDeserializer extends JsonDeserializer<Date> {

    @Override
    public Date deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String dateString = p.getText();

        if (dateString == null || dateString.isEmpty()) {
            return null;
        }

        try {
            // Parse date in yyyy-MM-dd format
            LocalDate localDate = LocalDate.parse(dateString, DateTimeFormatter.ISO_LOCAL_DATE);
            return Date.valueOf(localDate);
        } catch (Exception e) {
            throw new IOException("Unable to parse date: " + dateString +
                    ". Expected format: yyyy-MM-dd", e);
        }
    }
}
