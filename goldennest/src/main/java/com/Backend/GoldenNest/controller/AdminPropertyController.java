package com.Backend.GoldenNest.controller;

import com.Backend.GoldenNest.dto.PropertyCardDto;
import com.Backend.GoldenNest.modal.Property;
import com.Backend.GoldenNest.modal.PropertyImage;
import com.Backend.GoldenNest.repository.PropertyRepository;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequestMapping("/api/admin/properties")
public class AdminPropertyController {

    private final PropertyRepository properties;

    public AdminPropertyController(PropertyRepository properties) {
        this.properties = properties;
    }

    private PropertyCardDto toCard(Property p) {
        PropertyCardDto dto = new PropertyCardDto();
        dto.id = p.getId();
        dto.title = p.getTitle();
        dto.city = p.getCity();
        dto.state = p.getState();
        dto.price = p.getPrice();
        dto.coverImageUrl = p.getImages().isEmpty() ? null : p.getImages().get(0).getUrl();
        dto.bedrooms = p.getBedrooms();
        dto.bathrooms = p.getBathrooms();
        dto.type = p.getType();
        dto.description = p.getDescription();
        dto.status = p.getStatus();

        // 🔹 New: owner info for admin cards
        if (p.getOwner() != null) {
            dto.ownerId = p.getOwner().getId();
            dto.ownerEmail = p.getOwner().getEmail();
            dto.ownerName =
                p.getOwner().getName() != null && !p.getOwner().getName().isBlank()
                    ? p.getOwner().getName()
                    : p.getOwner().getEmail(); // fallback to email if name is empty
        }

        return dto;
    }


    // ---- List by status ----
    @GetMapping
    public Page<PropertyCardDto> listByStatus(
            @RequestParam(defaultValue = "PENDING") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        String normalized = status.toUpperCase(Locale.ROOT);
        if (!Set.of("PENDING", "APPROVED", "REJECTED").contains(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: " + status);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Property> pageData = properties.findByStatus(normalized, pageable);
        return pageData.map(this::toCard);
    }

    // ---- Summary counts (for donut / stats) ----
    @GetMapping("/summary")
    public Map<String, Long> summary() {
        Map<String, Long> res = new HashMap<>();
        res.put("pending", properties.countByStatus("PENDING"));
        res.put("approved", properties.countByStatus("APPROVED"));
        res.put("rejected", properties.countByStatus("REJECTED"));
        res.put("total", properties.count());
        return res;
    }

    // ---- Update status for a property ----
    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String newStatus = Optional.ofNullable(body.get("status"))
                .map(s -> s.toUpperCase(Locale.ROOT))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "status is required"));

        if (!Set.of("PENDING", "APPROVED", "REJECTED").contains(newStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: " + newStatus);
        }

        Property p = properties.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found"));

        p.setStatus(newStatus);
        properties.save(p);

        Map<String, Object> res = new HashMap<>();
        res.put("id", p.getId());
        res.put("status", p.getStatus());
        return ResponseEntity.ok(res);
    }
}
