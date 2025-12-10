package com.Backend.GoldenNest.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class PropertyCreateDto {
  @NotBlank public String title;
  public String description;

  @NotNull @DecimalMin("0.0") public BigDecimal price;
  @NotNull @Min(0) public Integer bedrooms;
  @NotNull @Min(0) public Integer bathrooms;

  @NotBlank public String address1;
  public String city;
  public String state;
  public String zip;

  public Integer areaSqft;
  public Double lat;
  public Double lng;

  public String propertyType;
  public String locationTag;
  public Integer yearBuilt;
  
  public String type;
  
  public String tenure;
  public LocalDate leaseStartDate;
  public Integer leaseTermYears;
  public LocalDate leaseExpiryDate;
  
  public java.util.List<String> floorPlans;
  public java.util.List<String> virtualTours;
  public java.util.List<String> documents;
// property type
  
  public String getTitle() {
	return title;
}

public String getTenure() {
	return tenure;
}

public void setTenure(String tenure) {
	this.tenure = tenure;
}

public LocalDate getLeaseStartDate() {
	return leaseStartDate;
}

public void setLeaseStartDate(LocalDate leaseStartDate) {
	this.leaseStartDate = leaseStartDate;
}

public Integer getLeaseTermYears() {
	return leaseTermYears;
}

public void setLeaseTermYears(Integer leaseTermYears) {
	this.leaseTermYears = leaseTermYears;
}

public LocalDate getLeaseExpiryDate() {
	return leaseExpiryDate;
}

public void setLeaseExpiryDate(LocalDate leaseExpiryDate) {
	this.leaseExpiryDate = leaseExpiryDate;
}

public java.util.List<String> getFloorPlans() {
	return floorPlans;
}

public void setFloorPlans(java.util.List<String> floorPlans) {
	this.floorPlans = floorPlans;
}

public java.util.List<String> getVirtualTours() {
	return virtualTours;
}

public void setVirtualTours(java.util.List<String> virtualTours) {
	this.virtualTours = virtualTours;
}

public java.util.List<String> getDocuments() {
	return documents;
}

public void setDocuments(java.util.List<String> documents) {
	this.documents = documents;
}

public void setTitle(String title) {
	this.title = title;
}

public String getType() { return type; }
public void setType(String type) { this.type = type; }


public String getDescription() {
	return description;
}

public void setDescription(String description) {
	this.description = description;
}

public BigDecimal getPrice() {
	return price;
}

public void setPrice(BigDecimal price) {
	this.price = price;
}

public Integer getBedrooms() {
	return bedrooms;
}

public void setBedrooms(Integer bedrooms) {
	this.bedrooms = bedrooms;
}

public Integer getBathrooms() {
	return bathrooms;
}

public void setBathrooms(Integer bathrooms) {
	this.bathrooms = bathrooms;
}

public String getAddress1() {
	return address1;
}

public void setAddress1(String address1) {
	this.address1 = address1;
}

public String getCity() {
	return city;
}

public void setCity(String city) {
	this.city = city;
}

public String getState() {
	return state;
}

public void setState(String state) {
	this.state = state;
}

public String getZip() {
	return zip;
}

public void setZip(String zip) {
	this.zip = zip;
}

public Integer getAreaSqft() {
	return areaSqft;
}

public void setAreaSqft(Integer areaSqft) {
	this.areaSqft = areaSqft;
}

public Double getLat() {
	return lat;
}

public void setLat(Double lat) {
	this.lat = lat;
}

public Double getLng() {
	return lng;
}

public void setLng(Double lng) {
	this.lng = lng;
}

public List<String> getImages() {
	return images;
}

public void setImages(List<String> images) {
	this.images = images;
}

/** Image URLs for now; we can add file upload later */
  public List<String> images;


public String getPropertyType() { return propertyType; }
public void setPropertyType(String propertyType) { this.propertyType = propertyType; }

public String getLocationTag() { return locationTag; }
public void setLocationTag(String locationTag) { this.locationTag = locationTag; }

public Integer getYearBuilt() { return yearBuilt; }
public void setYearBuilt(Integer yearBuilt) { this.yearBuilt = yearBuilt; }
}
