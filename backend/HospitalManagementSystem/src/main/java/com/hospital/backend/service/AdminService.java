package com.hospital.backend.service;

import com.hospital.backend.entity.Admin;
import java.util.Optional;

public interface AdminService {
    Optional<Admin> findByEmail(String email);
    Admin createOrUpdate(Admin admin);
}
