package com.Backend.GoldenNest.controller;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Backend.GoldenNest.repository.UserRepository;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/agents")
    public List<UserMini> listAgents() {
        return userRepository.findByRoleIgnoreCase("AGENT")
                .stream()
                .map(u -> new UserMini(
                        u.getId(),
                        u.getName(),
                        u.getEmail(),
                        u.getRole()
                ))
                .toList();
    }

    record UserMini(Long id, String name, String email, String role) {}
}
