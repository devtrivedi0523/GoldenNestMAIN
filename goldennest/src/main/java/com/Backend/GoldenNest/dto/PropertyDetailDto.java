package com.Backend.GoldenNest.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class PropertyDetailDto {
    public Long id;
    public String title;
    public String description;
    public String city;
    public String state;
    public BigDecimal price;
    public Integer bedrooms;
    public Integer bathrooms;
    public Integer areaSqft;
    public List<String> images; // image URLs
    
    public Double lat;
    public Double lng;
    
    public String tenure;
    public LocalDate leaseStartDate;
    public Integer leaseTermYears;
    public LocalDate leaseExpiryDate;

    public java.util.List<String> floorPlans;
    public java.util.List<String> virtualTours;
    public java.util.List<String> documents;

}
