package com.Backend.GoldenNest.repository;

import com.Backend.GoldenNest.modal.Area;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AreaRepository extends JpaRepository<Area, Integer> {

    Optional<Area> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    @Query("select distinct a from Area a left join fetch a.users")
    List<Area> findAllWithUsers();

	Optional<Area> findById(Long areaId);
}
