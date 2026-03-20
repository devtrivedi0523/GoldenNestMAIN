package com.Backend.GoldenNest.controller;

import com.Backend.GoldenNest.modal.Company;
import com.Backend.GoldenNest.modal.User;
import com.Backend.GoldenNest.repository.CompanyRepository;
import com.Backend.GoldenNest.repository.UserRepository;
import com.Backend.GoldenNest.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final UserRepository users;
	private final PasswordEncoder encoder;
	private final JwtService jwt;
	private final CompanyRepository companies;

	// ✅ Single constructor with all 4 dependencies
	public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt, CompanyRepository companies) {
		this.users = users;
		this.encoder = encoder;
		this.jwt = jwt;
		this.companies = companies;
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
		String email = body.get("email");
		String password = body.get("password");
		String name = body.get("name");
		String requestedRole = body.get("role");
		String companyName = body.get("companyName");

		if (email == null || password == null) {
			return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
		}
		if (users.existsByEmail(email)) {
			return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
		}

		String role = "USER";
		if ("AGENT".equalsIgnoreCase(requestedRole)) {
			role = "AGENT";
		} else if ("COMPANY".equalsIgnoreCase(requestedRole)) {
			if (companyName == null || companyName.isBlank()) {
				return ResponseEntity.badRequest().body(Map.of("error", "Company name is required"));
			}
			role = "COMPANY";
		}

		User u = new User();
		u.setEmail(email);
		u.setPassword(encoder.encode(password));
		u.setRole(role);
		if (name != null && !name.isBlank())
			u.setName(name);

		if ("COMPANY".equals(role)) {
			Company company = new Company();
			company.setName(companyName);
			Company saved = companies.save(company);
			u.setCompany(saved);
		}

		String phone = body.get("phone");

		// add validation after email/password check:
		if (phone == null || phone.isBlank()) {
			return ResponseEntity.badRequest().body(Map.of("error", "Phone number is required"));
		}

		// then set it on the user before saving:
		u.setPhone(phone);

		users.save(u);
		return ResponseEntity.ok(Map.of("status", "ok"));
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpServletResponse resp) {
		var u = users.findByEmail(body.get("email")).orElse(null);
		if (u == null || !encoder.matches(body.get("password"), u.getPassword()))
			return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
		String access = jwt.createAccess(u.getEmail(), Map.of("role", u.getRole()));
		String refresh = jwt.createRefresh(u.getEmail());

		Cookie cookie = new Cookie("refresh_token", refresh);
		cookie.setHttpOnly(true);
		cookie.setSecure(false);
		cookie.setPath("/api/auth");
		cookie.setMaxAge(14 * 24 * 3600);
		resp.addCookie(cookie);

		return ResponseEntity.ok(Map.of("accessToken", access));
	}

	@PostMapping("/refresh")
	public ResponseEntity<?> refresh(@CookieValue(name = "refresh_token", required = false) String refresh) {
		if (refresh == null)
			return ResponseEntity.status(401).body(Map.of("error", "No refresh cookie"));
		String email = jwt.subject(refresh);
		var u = users.findByEmail(email).orElse(null);
		if (u == null)
			return ResponseEntity.status(401).body(Map.of("error", "Invalid refresh"));
		String access = jwt.createAccess(email, Map.of("role", u.getRole()));
		return ResponseEntity.ok(Map.of("accessToken", access));
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpServletResponse resp) {
		Cookie cookie = new Cookie("refresh_token", "");
		cookie.setHttpOnly(true);
		cookie.setSecure(false);
		cookie.setPath("/api/auth");
		cookie.setMaxAge(0);
		resp.addCookie(cookie);
		return ResponseEntity.ok(Map.of("status", "logged out"));
	}
}