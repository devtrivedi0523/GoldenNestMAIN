package com.Backend.GoldenNest.controller;

import com.Backend.GoldenNest.modal.Area;
import com.Backend.GoldenNest.modal.User;
import com.Backend.GoldenNest.repository.AreaRepository;
import com.Backend.GoldenNest.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/areas")
public class AreaController {

    private final AreaRepository areaRepository;
    private final UserRepository userRepository;

    public AreaController(AreaRepository areaRepository, UserRepository userRepository) {
        this.areaRepository = areaRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Area> createArea(@RequestBody Area area) {
        if (area.getName() == null || area.getName().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        if (areaRepository.existsByNameIgnoreCase(area.getName())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(areaRepository.save(area));
    }

    @PutMapping("/{areaId}/assign/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignUserToArea(@PathVariable Long areaId, @PathVariable Long userId) {

        Area area = areaRepository.findById(areaId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();

        if (!"AGENT".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.badRequest().body("User must have AGENT role");
        }

        user.getAreas().add(area);     // owning side
        userRepository.save(user);     // save owning side

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{areaId}/remove/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> removeUserFromArea(@PathVariable Long areaId, @PathVariable Long userId) {

        Area area = areaRepository.findById(areaId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();

        user.getAreas().remove(area);  // owning side
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','AGENT')")
    public List<AreaResponse> listAreas() {
        return areaRepository.findAllWithUsers().stream()
                .map(area -> new AreaResponse(
                        area.getId(),
                        area.getName(),
                        area.getUsers().stream()
                                .map(u -> new UserMini(u.getId(), u.getName(), u.getEmail(), u.getRole()))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

    record AreaResponse(Long id, String name, List<UserMini> users) {}
    record UserMini(Long id, String name, String email, String role) {}
}
