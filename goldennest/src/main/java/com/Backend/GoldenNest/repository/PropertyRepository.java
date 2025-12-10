package com.Backend.GoldenNest.repository;

import com.Backend.GoldenNest.modal.Property;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {
	Page<Property> findByStatus(String status, Pageable pageable);
	
	Page<Property> findByStatusAndCityContainingIgnoreCase(String status, String city, Pageable pageable);
	
    Page<Property> findByOwnerId(Integer ownerId, Pageable pageable);


    long countByStatus(String status);
}
