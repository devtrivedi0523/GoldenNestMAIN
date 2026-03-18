package com.Backend.GoldenNest.controller;

import com.Backend.GoldenNest.modal.User;
import com.Backend.GoldenNest.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
				.map(u -> new UserMiniDto(u.getId(), u.getName(), u.getEmail())).toList();
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

	public record UserMiniDto(Long id, String name, String email) {
	}
	
	// Assign an agent to the current company
	@PutMapping("/agents/{agentId}")
	public ResponseEntity<String> addAgentToCompany(@PathVariable Long agentId) {
	    User current = getCurrentUser();
	    String role = String.valueOf(current.getRole()).toUpperCase();
	    if (!role.equals("COMPANY") && !role.equals("ADMIN") && !role.equals("SUPER_ADMIN")) {
	        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
	    }
	    if (current.getCompany() == null) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You are not linked to a company");
	    }

	    User agent = users.findById(agentId)
	        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agent not found"));

	    String agentRole = String.valueOf(agent.getRole()).toUpperCase();
	    if (!agentRole.equals("AGENT")) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not an agent");
	    }

	    agent.setCompany(current.getCompany());
	    users.save(agent);
	    return ResponseEntity.ok("Agent assigned to company");
	}

	// List all agents not yet assigned to any company
	@GetMapping("/agents/available")
	public List<UserMiniDto> availableAgents() {
	    User current = getCurrentUser();
	    String role = String.valueOf(current.getRole()).toUpperCase();
	    if (!role.equals("COMPANY") && !role.equals("ADMIN") && !role.equals("SUPER_ADMIN")) {
	        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
	    }
	    return users.findAgentsWithNoCompany().stream()
	            .map(u -> new UserMiniDto(u.getId(), u.getName(), u.getEmail()))
	            .toList();
	}
}