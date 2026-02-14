package com.Backend.GoldenNest.modal;

import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "areas")
public class Area {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToMany(mappedBy = "areas", fetch = FetchType.LAZY)
    private Set<User> users = new HashSet<>();

    // Constructors
    public Area() {}
    public Area(String name) { this.name = name; }

    // Getters / Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Set<User> getUsers() { return users; }
    public void setUsers(Set<User> users) { this.users = users; }
}
