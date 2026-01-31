package com.hospital.backend.serviceImpl;

import com.hospital.backend.entity.Specialization;
import com.hospital.backend.repository.SpecializationRepository;
import com.hospital.backend.service.SpecializationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SpecializationServiceImpl implements SpecializationService {

    @Autowired
    private SpecializationRepository specializationRepository;

    @Override
    public Specialization createSpecialization(Specialization specialization) {
        return specializationRepository.createSpecialization(specialization);
    }

    @Override
    public List<Specialization> getAllSpecializations() {
        return specializationRepository.getAllSpecializations();
    }

    @Override
    public Optional<Specialization> getSpecializationById(int id) {
        return specializationRepository.getSpecializationById(id);
    }

    @Override
    public Specialization updateSpecialization(int id, Specialization specialization) {
        if (specializationRepository.existsById(id)) {
            specialization.setSpId(id);
            return specializationRepository.createSpecialization(specialization);
        }
        throw new RuntimeException("Specialization not found with id: " + id);
    }

    @Override
    public void deleteSpecialization(int id) {
        specializationRepository.deleteSpecialization(id);
    }

    @Override
    public Optional<Specialization> getSpecializationByName(String name) {
        return specializationRepository.getSpecializationByName(name);
    }

    @Override
    public boolean existsById(int id) {
        return specializationRepository.existsById(id);
    }
    
}