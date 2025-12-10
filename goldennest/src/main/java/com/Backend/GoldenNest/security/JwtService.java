package com.Backend.GoldenNest.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {
  private final Key key;
  private final long accessMinutes;
  private final long refreshDays;

  public JwtService(
      @Value("${app.jwt.secret}") String secret,
      @Value("${app.jwt.access-minutes}") long accessMinutes,
      @Value("${app.jwt.refresh-days}") long refreshDays) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes());
    this.accessMinutes = accessMinutes;
    this.refreshDays = refreshDays;
  }

  public String createAccess(String subject, Map<String,Object> claims) {
    Instant now = Instant.now();
    return Jwts.builder()
      .setClaims(claims).setSubject(subject)
      .setIssuedAt(Date.from(now))
      .setExpiration(Date.from(now.plusSeconds(accessMinutes*60)))
      .signWith(key, SignatureAlgorithm.HS256)
      .compact();
  }

  public String createRefresh(String subject) {
    Instant now = Instant.now();
    return Jwts.builder()
      .setSubject(subject)
      .setIssuedAt(Date.from(now))
      .setExpiration(Date.from(now.plusSeconds(refreshDays*24*3600)))
      .signWith(key, SignatureAlgorithm.HS256)
      .compact();
  }

  public Jws<Claims> parse(String jwt) { return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt); }
  public String subject(String jwt) { return parse(jwt).getBody().getSubject(); }
}
