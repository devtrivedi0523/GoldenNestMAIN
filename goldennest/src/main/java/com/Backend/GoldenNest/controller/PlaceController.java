package com.Backend.GoldenNest.controller;

import com.Backend.GoldenNest.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api")
public class PlaceController {

    @Autowired
    private PropertyRepository propertyRepository;

    // Allow your frontend origin(s) here. For dev it's permissive.
    @CrossOrigin(origins = "*")
    @GetMapping("/places")
    public ResponseEntity<?> places(@RequestParam(value = "input", required = false) String input) {
        if (input == null || input.trim().isEmpty()) {
            return ResponseEntity.ok(Map.of("predictions", Collections.emptyList()));
        }

        String q = input.trim().toLowerCase();

        // Fetch distinct lists from repository (fast)
        List<String> cities = Optional.ofNullable(propertyRepository.findDistinctCities()).orElse(Collections.emptyList());
        List<String> nhoods = Optional.ofNullable(propertyRepository.findDistinctLocationTags()).orElse(Collections.emptyList());
        List<String> zips = Optional.ofNullable(propertyRepository.findDistinctZips()).orElse(Collections.emptyList());

        // Combine, filter by substring, dedupe and limit
        List<Map<String, String>> preds = Stream.of(cities, nhoods, zips)
                .flatMap(Collection::stream)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .filter(s -> s.toLowerCase().contains(q))
                .distinct()
                .limit(15)
                .map(s -> Map.of(
                        "id", s,
                        "description", s,
                        "place_type", inferPlaceType(s, cities, nhoods, zips)
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("predictions", preds));
    }

    // Helper to guess type based on presence in lists
    private static String inferPlaceType(String s, List<String> cities, List<String> nhoods, List<String> zips) {
        if (zips.contains(s)) return "postcode";
        if (cities.contains(s)) return "city";
        if (nhoods.contains(s)) return "neighbourhood";
        return "place";
    }
}
