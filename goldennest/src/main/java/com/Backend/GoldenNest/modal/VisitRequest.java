package com.Backend.GoldenNest.modal;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "visit_request")
public class VisitRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    private Instant preferredAt;
    private Instant scheduledAt;
    private String status; // PENDING, CONFIRMED, DECLINED
    private String note;

    public VisitRequest() {}

    public VisitRequest(Long id, User user, Property property, Instant preferredAt, Instant scheduledAt,
                        String status, String note) {
        this.id = id;
        this.user = user;
        this.property = property;
        this.preferredAt = preferredAt;
        this.scheduledAt = scheduledAt;
        this.status = status;
        this.note = note;
    }

    // getters/setters/toString

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public Instant getPreferredAt() { return preferredAt; }
    public void setPreferredAt(Instant preferredAt) { this.preferredAt = preferredAt; }

    public Instant getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(Instant scheduledAt) { this.scheduledAt = scheduledAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    @Override
    public String toString() {
        return "VisitRequest [id=" + id + ", status=" + status + "]";
    }
}
