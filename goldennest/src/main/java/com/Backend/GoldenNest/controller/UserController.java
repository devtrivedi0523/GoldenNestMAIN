package com.Backend.GoldenNest.controller;

import com.Backend.GoldenNest.modal.User;
import com.Backend.GoldenNest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserRepository users;

    @Autowired
    public UserController(UserRepository users) {
        this.users = users;
    }

    @GetMapping("/me")
    public MeDto me(Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not logged in");
        }

        String email = authentication.getName(); // from JWT
        User u = users.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        MeDto dto = new MeDto();
        dto.setId(u.getId());
        dto.setName(u.getName());
        dto.setEmail(u.getEmail());
        dto.setRole(u.getRole());   // optional but nice to have

        return dto;
    }


    // DTO returned to frontend
    public static class MeDto {
        private Integer id;
        private String name;
        private String email;
        private String role;

        public MeDto() {}

        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}
