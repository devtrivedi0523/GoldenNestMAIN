package com.Backend.GoldenNest.controller;

import com.Backend.GoldenNest.dto.InquiryCreateDto;
import com.Backend.GoldenNest.modal.Inquiry;
import com.Backend.GoldenNest.modal.Property;
import com.Backend.GoldenNest.repository.InquiryRepository;
import com.Backend.GoldenNest.repository.PropertyRepository;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {

    private final InquiryRepository inquiries;
    private final PropertyRepository properties;

    public InquiryController(InquiryRepository inquiries, PropertyRepository properties) {
        this.inquiries = inquiries;
        this.properties = properties;
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody InquiryCreateDto dto) {
        Property prop = properties.findById(dto.propertyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Property not found"));

        Inquiry i = new Inquiry();
        i.setProperty(prop);
        i.setName(dto.name);
        i.setEmail(dto.email);
        i.setPhone(dto.phone);
        i.setMessage(dto.message);

        inquiries.save(i);
        return ResponseEntity.ok().build();
    }
}
