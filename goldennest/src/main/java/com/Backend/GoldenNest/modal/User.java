package com.Backend.GoldenNest.modal;

import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String name;
    private String phone;

    // USER / AGENT / COMPANY / ADMIN / SUPER_ADMIN
    private String role = "USER";

    // ✅ NEW: links USER/AGENT/COMPANY to companies.id
 // ✅ Company relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<VisitRequest> visitRequests = new ArrayList<>();

    // favorites / saved properties
    @ManyToMany
    @JoinTable(
        name = "favorite",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "property_id")
    )
    private List<Property> savedProperties = new ArrayList<>();

    // agent <-> area mapping
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_areas",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "area_id")
    )
    private Set<Area> areas = new HashSet<>();

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    // ✅ company id
//    public Long getCompanyId() { return companyId; }
//    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public List<Property> getSavedProperties() { return savedProperties; }
    public void setSavedProperties(List<Property> savedProperties) { this.savedProperties = savedProperties; }

    public List<VisitRequest> getVisitRequests() { return visitRequests; }
    public void setVisitRequests(List<VisitRequest> visitRequests) { this.visitRequests = visitRequests; }

    public Set<Area> getAreas() { return areas; }
    public void setAreas(Set<Area> areas) { this.areas = areas; }

    // convenience
    public void addArea(Area area) {
        this.areas.add(area);
        area.getUsers().add(this);
    }

    public void removeArea(Area area) {
        this.areas.remove(area);
        area.getUsers().remove(this);
    }
}