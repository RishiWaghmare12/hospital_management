package com.hospital.backend.controller;

import com.hospital.backend.entity.Specialization;
import com.hospital.backend.service.SpecializationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/specializations")
@CrossOrigin(origins = "*")
public class SpecializationController {

    @Autowired
    private SpecializationService specializationService;

    @GetMapping
    public List<Specialization> getAllSpecializations() {
        return specializationService.getAllSpecializations();
    }

    @GetMapping("/{id}")
    public Specialization getSpecializationById(@PathVariable int id) {
        return specializationService.getSpecializationById(id)
                .orElseThrow(() -> new RuntimeException("Specialization not found with id: " + id));
    }

    @PostMapping
    public Specialization createSpecialization(@RequestBody Specialization specialization) {
        return specializationService.createSpecialization(specialization);
    }

    @PutMapping("/{id}")
    public Specialization updateSpecialization(@PathVariable int id, @RequestBody Specialization specialization) {
        return specializationService.updateSpecialization(id, specialization);
    }

    @DeleteMapping("/{id}")
    public void deleteSpecialization(@PathVariable int id) {
        specializationService.deleteSpecialization(id);
    }

    @GetMapping("/name/{name}")
    public Specialization getSpecializationByName(@PathVariable String name) {
        return specializationService.getSpecializationByName(name)
                .orElseThrow(() -> new RuntimeException("Specialization not found with name: " + name));
    }


}
