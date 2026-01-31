package com.hospital.backend.repository;

import com.hospital.backend.entity.Admin;
import java.util.Optional;

public interface AdminRepository {
    Optional<Admin> findByEmail(String email);
    Admin save(Admin admin);
}
