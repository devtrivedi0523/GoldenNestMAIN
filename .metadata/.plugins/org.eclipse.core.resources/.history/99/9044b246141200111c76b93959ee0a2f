package com.Backend.GoldenNest.controller;

import com.Backend.GoldenNest.modal.Area;
import com.Backend.GoldenNest.modal.User;
import com.Backend.GoldenNest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserRepository users;

    @Autowired
    public UserController(UserRepository users) {
        this.users = users;
    }

    /**
     * Returns the currently logged-in user (from JWT) + assigned areas.
     * This is used by frontend to know role and (for AGENT/ADMIN) area assignment.
     */
    @GetMapping("/me")
    public MeDto me(Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not logged in");
        }

        String email = authentication.getName(); // from JWT (username/email)

        // ✅ IMPORTANT: fetch user WITH areas
        User u = users.findByEmailWithAreas(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        MeDto dto = new MeDto();
        dto.setId(u.getId());
        dto.setName(u.getName());
        dto.setEmail(u.getEmail());
        dto.setRole(u.getRole());

        // ✅ include areas (safe mini DTO to avoid recursion issues)
        List<AreaMini> areaList = new ArrayList<>();
        if (u.getAreas() != null) {
            areaList = u.getAreas().stream()
                    .map(a -> new AreaMini(a.getId(), a.getName()))
                    .collect(Collectors.toList());
        }
        dto.setAreas(areaList);

        return dto;
    }

    // ---------------- DTOs returned to frontend ----------------

    public static class MeDto {
        private Long id;
        private String name;
        private String email;
        private String role;

        // ✅ NEW: assigned areas
        private List<AreaMini> areas = new ArrayList<>();

        public MeDto() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public List<AreaMini> getAreas() { return areas; }
        public void setAreas(List<AreaMini> areas) {
            this.areas = (areas == null) ? new ArrayList<>() : areas;
        }
    }

    public static class AreaMini {
        private Long id;
        private String name;

        public AreaMini() {}

        public AreaMini(Long id, String name) {
            this.id = id;
            this.name = name;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
}