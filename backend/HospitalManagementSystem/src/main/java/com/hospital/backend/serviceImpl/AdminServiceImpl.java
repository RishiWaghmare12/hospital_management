package com.hospital.backend.serviceImpl;

import com.hospital.backend.entity.Admin;
import com.hospital.backend.repository.AdminRepository;
import com.hospital.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public Optional<Admin> findByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    @Override
    public Admin createOrUpdate(Admin admin) {
        return adminRepository.save(admin);
    }
}
