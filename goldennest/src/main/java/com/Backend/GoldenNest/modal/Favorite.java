package com.Backend.GoldenNest.modal;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "favorite")
public class Favorite {

    @EmbeddedId
    private FavoriteId id = new FavoriteId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("propertyId")
    private Property property;

    private Instant createdAt = Instant.now();

    // Getters & Setters
    public FavoriteId getId() { return id; }
    public void setId(FavoriteId id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
