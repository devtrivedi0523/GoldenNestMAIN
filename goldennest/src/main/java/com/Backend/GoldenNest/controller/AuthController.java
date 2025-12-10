package com.Backend.GoldenNest.controller;

import com.Backend.GoldenNest.modal.User;
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

  public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
    this.users = users; this.encoder = encoder; this.jwt = jwt;
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
      String email = body.get("email");
      String password = body.get("password");
      String name = body.get("name"); // <- coming from frontend Sell.jsx

      if (email == null || password == null) {
          return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
      }

      if (users.existsByEmail(email)) {
          return ResponseEntity
                  .badRequest()
                  .body(Map.of("error", "Email already exists"));
      }

      User u = new User();
      u.setEmail(email);
      u.setPassword(encoder.encode(password));
      u.setRole("USER");

      // ✅ store the name (if provided)
      if (name != null && !name.isBlank()) {
          u.setName(name);
      }

      users.save(u);

      return ResponseEntity.ok(Map.of("status", "ok"));
  }


  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody Map<String,String> body, HttpServletResponse resp) {
    var u = users.findByEmail(body.get("email")).orElse(null);
    if (u == null || !encoder.matches(body.get("password"), u.getPassword()))
      return ResponseEntity.status(401).body(Map.of("error","Invalid credentials"));
    String access = jwt.createAccess(u.getEmail(), Map.of("role", u.getRole()));
    String refresh = jwt.createRefresh(u.getEmail());

    Cookie cookie = new Cookie("refresh_token", refresh);
    cookie.setHttpOnly(true); cookie.setSecure(false); // set true in HTTPS
    cookie.setPath("/api/auth"); cookie.setMaxAge(14*24*3600);
    resp.addCookie(cookie);

    return ResponseEntity.ok(Map.of("accessToken", access));
  }

  @PostMapping("/refresh")
  public ResponseEntity<?> refresh(@CookieValue(name="refresh_token", required=false) String refresh) {
    if (refresh == null) return ResponseEntity.status(401).body(Map.of("error","No refresh cookie"));
    String email = jwt.subject(refresh);
    var u = users.findByEmail(email).orElse(null);
    if (u == null) return ResponseEntity.status(401).body(Map.of("error","Invalid refresh"));
    String access = jwt.createAccess(email, Map.of("role", u.getRole()));
    return ResponseEntity.ok(Map.of("accessToken", access));
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpServletResponse resp) {
    Cookie cookie = new Cookie("refresh_token", "");
    cookie.setHttpOnly(true); cookie.setSecure(false);
    cookie.setPath("/api/auth"); cookie.setMaxAge(0);
    resp.addCookie(cookie);
    return ResponseEntity.ok(Map.of("status","logged out"));
  }
}
