package com.Backend.GoldenNest.controller;

import com.Backend.GoldenNest.modal.User;
import com.Backend.GoldenNest.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    private final UserRepository users;

    public CompanyController(UserRepository users) {
        this.users = users;
    }

    // ✅ Company can see agents that belong to its company
    @GetMapping("/agents")
    public List<UserMiniDto> myAgents() {
        User current = getCurrentUser();

        String role = String.valueOf(current.getRole()).toUpperCase();
        if (!role.equals("COMPANY") && !role.equals("ADMIN") && !role.equals("SUPER_ADMIN")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
        }

        if (current.getCompany() == null) {
            return List.of();
        }

        Long companyId = current.getCompany().getId();

        return users.findAgentsByCompanyId(companyId).stream()
                .map(u -> new UserMiniDto(u.getId(), u.getName(), u.getEmail()))
                .toList();
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not logged in");
        }
        String email = auth.getName();
        return users.findByEmailWithAreasAndCompany(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    public record UserMiniDto(Long id, String name, String email) {}
}