package com.Backend.GoldenNest.repository;

import com.Backend.GoldenNest.modal.VisitRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VisitRequestRepository extends JpaRepository<VisitRequest, Long> {
    List<VisitRequest> findByUser_Id(Integer userId);
    List<VisitRequest> findByProperty_Id(Long propertyId);
}
