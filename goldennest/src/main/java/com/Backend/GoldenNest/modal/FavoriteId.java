package com.Backend.GoldenNest.modal;

import jakarta.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class FavoriteId implements Serializable {
    private Integer userId;
    private Long propertyId;

    public FavoriteId() {}
    public FavoriteId(Integer userId, Long propertyId) {
        this.userId = userId;
        this.propertyId = propertyId;
    }

    // getters/setters/hashCode/equals
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FavoriteId)) return false;
        FavoriteId that = (FavoriteId) o;
        return userId.equals(that.userId) && propertyId.equals(that.propertyId);
    }

    @Override
    public int hashCode() {
        return userId.hashCode() + propertyId.hashCode();
    }
}
