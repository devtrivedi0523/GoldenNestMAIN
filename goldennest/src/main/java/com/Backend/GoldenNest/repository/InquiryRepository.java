package com.Backend.GoldenNest.repository;

import com.Backend.GoldenNest.modal.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    List<Inquiry> findByProperty_Id(Long propertyId);
}
