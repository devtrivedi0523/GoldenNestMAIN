package com.Backend.GoldenNest.repository;

import com.Backend.GoldenNest.modal.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {}