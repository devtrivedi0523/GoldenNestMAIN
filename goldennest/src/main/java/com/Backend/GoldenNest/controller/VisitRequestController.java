package com.Backend.GoldenNest.controller;

import com.Backend.GoldenNest.dto.VisitRequestCreateDto;
import com.Backend.GoldenNest.modal.Property;
import com.Backend.GoldenNest.modal.User;
import com.Backend.GoldenNest.modal.VisitRequest;
import com.Backend.GoldenNest.repository.PropertyRepository;
import com.Backend.GoldenNest.repository.UserRepository;
import com.Backend.GoldenNest.repository.VisitRequestRepository;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

@RestController
@RequestMapping("/api/visit-requests")
public class VisitRequestController {

    private final VisitRequestRepository visits;
    private final PropertyRepository properties;
    private final UserRepository users;

    public VisitRequestController(VisitRequestRepository visits, PropertyRepository properties, UserRepository users) {
        this.visits = visits;
        this.properties = properties;
        this.users = users;
    }

    // For now we pass userId as a query param until JWT is in place
    @PostMapping
    public ResponseEntity<Void> create(@RequestBody VisitRequestCreateDto dto,
                                       @RequestParam Integer userId) {

        Property prop = properties.findById(dto.propertyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Property not found"));
        User user = users.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found"));

        VisitRequest vr = new VisitRequest();
        vr.setProperty(prop);
        vr.setUser(user);
        vr.setPreferredAt(Instant.parse(dto.preferredAtIso));
        vr.setStatus("PENDING");
        vr.setNote(dto.note);

        visits.save(vr);
        return ResponseEntity.ok().build();
    }
}
