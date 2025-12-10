package com.Backend.GoldenNest.repository;

import com.Backend.GoldenNest.modal.PropertyImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PropertyImageRepository extends JpaRepository<PropertyImage, Long> {
    List<PropertyImage> findByProperty_IdOrderBySortAsc(Long propertyId);
}
