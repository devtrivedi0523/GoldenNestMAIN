package com.Backend.GoldenNest.repository;

import com.Backend.GoldenNest.modal.Favorite;
import com.Backend.GoldenNest.modal.FavoriteId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, FavoriteId> {
    List<Favorite> findByUser_Id(Integer userId);
    boolean existsByUser_IdAndProperty_Id(Integer userId, Long propertyId);
}
