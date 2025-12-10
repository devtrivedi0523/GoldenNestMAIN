package com.Backend.GoldenNest.security;

import com.Backend.GoldenNest.repository.UserRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends GenericFilter {

  private final JwtService jwt;
  private final UserRepository users;

  public JwtAuthFilter(JwtService jwt, UserRepository users) { this.jwt = jwt; this.users = users; }

  @Override
  public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
    HttpServletRequest http = (HttpServletRequest) req;
    String auth = http.getHeader("Authorization");
    if (auth != null && auth.startsWith("Bearer ")) {
      String token = auth.substring(7);
      try {
        String email = jwt.subject(token);
        var user = users.findByEmail(email).orElse(null);
        if (user != null) {
          var authToken = new UsernamePasswordAuthenticationToken(
              email, null, List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole())));
          SecurityContextHolder.getContext().setAuthentication(authToken);
        }
      } catch (Exception ignored) {}
    }
    chain.doFilter(req, res);
  }
}
