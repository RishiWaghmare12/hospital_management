package com.hospital.backend.repository;

import com.hospital.backend.entity.Specialization;
import java.util.List;
import java.util.Optional;

public interface SpecializationRepository {
	Specialization createSpecialization(Specialization specialization);
	List<Specialization> getAllSpecializations();
	Optional<Specialization> getSpecializationById(int id);
	Specialization updateSpecialization(Specialization specialization);
	 void deleteSpecialization(int id);
    Optional<Specialization> getSpecializationByName(String name);
    boolean existsById(int id);
}