package com.Backend.GoldenNest.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Value("${CLOUDINARY_URL}")
    private String cloudinaryUrl;

    @Bean
    public Cloudinary cloudinary() {
        // Cloudinary automatically parses the CLOUDINARY_URL format:
        // cloudinary://api_key:api_secret@cloud_name
        return new Cloudinary(cloudinaryUrl);
    }
}