package com.Backend.GoldenNest.modal;

import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String name;
    private String phone;
    private String role = "USER"; // USER / AGENT / ADMIN

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<VisitRequest> visitRequests = new ArrayList<>();

    // Optional: favorites or saved properties
    @ManyToMany
    @JoinTable(
        name = "favorite",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "property_id")
    )
    private List<Property> savedProperties = new ArrayList<>();

    // --- Getters & Setters ---
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

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

    public List<Property> getSavedProperties() { return savedProperties; }
    public void setSavedProperties(List<Property> savedProperties) { this.savedProperties = savedProperties; }

    public List<VisitRequest> getVisitRequests() { return visitRequests; }
    public void setVisitRequests(List<VisitRequest> visitRequests) { this.visitRequests = visitRequests; }
}
