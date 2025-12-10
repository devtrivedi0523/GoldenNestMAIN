package com.Backend.GoldenNest.modal;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "property_image")
public class PropertyImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;
    private Integer sort = 0;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    public PropertyImage() {}

    public PropertyImage(Long id, String url, Integer sort, Property property) {
        this.id = id;
        this.url = url;
        this.sort = sort;
        this.property = property;
    }

    

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Integer getSort() { return sort; }
    public void setSort(Integer sort) { this.sort = sort; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    @Override
    public String toString() {
        return "PropertyImage [id=" + id + ", url=" + url + ", sort=" + sort + "]";
    }
}