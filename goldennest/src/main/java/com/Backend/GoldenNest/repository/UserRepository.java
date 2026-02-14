package com.Backend.GoldenNest.repository;

import com.Backend.GoldenNest.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
    @Query("select u from User u left join fetch u.areas where u.id = :id")
    Optional<User> findByIdWithAreas(@Param("id") Long userId);
    List<User> findByRoleIgnoreCase(String role);

}
