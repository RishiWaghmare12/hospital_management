package com.hospital.backend.service;

import com.hospital.backend.entity.Specialization;
import java.util.List;
import java.util.Optional;

public interface SpecializationService {
    Specialization createSpecialization(Specialization specialization);
    List<Specialization> getAllSpecializations();
    Optional<Specialization> getSpecializationById(int id);
    Specialization updateSpecialization(int id, Specialization specialization);
    void deleteSpecialization(int id);
    Optional<Specialization> getSpecializationByName(String name);
    boolean existsById(int id);
}