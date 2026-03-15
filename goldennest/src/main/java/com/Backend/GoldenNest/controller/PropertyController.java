package com.Backend.GoldenNest.controller;

import com.Backend.GoldenNest.dto.PropertyCardDto;
import com.Backend.GoldenNest.dto.PropertyCreateDto;
import com.Backend.GoldenNest.dto.PropertyDetailDto;
import com.Backend.GoldenNest.modal.Area;
import com.Backend.GoldenNest.modal.Company;
import com.Backend.GoldenNest.modal.Property;
import com.Backend.GoldenNest.modal.PropertyImage;
import com.Backend.GoldenNest.modal.User;
import com.Backend.GoldenNest.repository.AreaRepository;
import com.Backend.GoldenNest.repository.PropertyImageRepository;
import com.Backend.GoldenNest.repository.PropertyRepository;
import com.Backend.GoldenNest.repository.UserRepository;
import com.Backend.GoldenNest.security.AreaAccessService;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyRepository properties;
    private final AreaRepository areas;
    private final AreaAccessService areaAccess;
    private final PropertyImageRepository images;

    @Autowired
    private UserRepository users;

    @Value("${google.maps.api.key:}")
    private String googleMapsApiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public PropertyController(
            PropertyRepository properties,
            PropertyImageRepository images,
            AreaRepository areas,
            AreaAccessService areaAccess
    ) {
        this.properties = properties;
        this.images = images;
        this.areas = areas;
        this.areaAccess = areaAccess;
    }

    /* =========================================================
       PUBLIC LIST (only APPROVED)
       ========================================================= */
    @GetMapping
    public Page<PropertyCardDto> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minBedrooms,
            @RequestParam(required = false) Integer minSize,
            @RequestParam(required = false) Integer maxSize,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) String locationTag,
            @RequestParam(required = false) Integer yearBuilt,
            @RequestParam(required = false) String q
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        Specification<Property> spec = (root, query, cb) ->
                cb.equal(root.get("status"), "APPROVED");

        if (city != null && !city.isBlank()) {
            String pattern = "%" + city.toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("city")), pattern));
        }

        if (locationTag != null && !locationTag.isBlank()) {
            String lt = locationTag.toLowerCase();
            spec = spec.and((root, query, cb) -> cb.equal(cb.lower(root.get("locationTag")), lt));
        }

        String typeFilter = null;
        if (propertyType != null && !propertyType.isBlank()) typeFilter = propertyType;
        else if (type != null && !type.isBlank()) typeFilter = type;

        if (typeFilter != null) {
            String tf = typeFilter.toLowerCase();
            spec = spec.and((root, query, cb) ->
                    cb.or(
                            cb.equal(cb.lower(root.get("type")), tf),
                            cb.equal(cb.lower(root.get("propertyType")), tf)
                    ));
        }

        if (yearBuilt != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("yearBuilt"), yearBuilt));
        }

        if (minPrice != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), maxPrice));
        }

        if (minBedrooms != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("bedrooms"), minBedrooms));
        }

        if (minSize != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("areaSqft"), minSize));
        }
        if (maxSize != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("areaSqft"), maxSize));
        }

        if (q != null && !q.isBlank()) {
            String pattern = "%" + q.toLowerCase() + "%";
            spec = spec.and((root, query, cb) ->
                    cb.or(
                            cb.like(cb.lower(root.get("title")), pattern),
                            cb.like(cb.lower(root.get("description")), pattern),
                            cb.like(cb.lower(root.get("city")), pattern),
                            cb.like(cb.lower(root.get("state")), pattern)
                    ));
        }

        Page<Property> pageData = properties.findAll(spec, pageable);
        return pageData.map(this::toPublicCardDto);
    }

    /* =========================================================
       DETAILS
       ========================================================= */
    @GetMapping("/{id}")
    public PropertyDetailDto get(@PathVariable Long id) {
        Property p = properties.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found"));

        PropertyDetailDto dto = new PropertyDetailDto();
        dto.id = p.getId();
        dto.title = p.getTitle();
        dto.description = p.getDescription();
        dto.city = p.getCity();
        dto.state = p.getState();
        dto.price = p.getPrice();
        dto.bedrooms = p.getBedrooms();
        dto.bathrooms = p.getBathrooms();
        dto.areaSqft = p.getAreaSqft();
        dto.images = p.getImages().stream().map(PropertyImage::getUrl).collect(Collectors.toList());

        dto.lat = p.getLat();
        dto.lng = p.getLng();

        dto.tenure = p.getTenure();
        dto.leaseStartDate = p.getLeaseStartDate();
        dto.leaseTermYears = p.getLeaseTermYears();
        dto.leaseExpiryDate = p.getLeaseExpiryDate();

        dto.floorPlans = splitCsv(p.getFloorPlans());
        dto.virtualTours = splitCsv(p.getVirtualTours());
        dto.documents = splitCsv(p.getDocuments());

        return dto;
    }

    /* =========================================================
       CREATE
       - ADMIN: APPROVED
       - COMPANY/AGENT/USER: PENDING (so main admin approves later)
       ========================================================= */
    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody PropertyCreateDto dto) {
        if (dto == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required");

        User current = getCurrentUser();

        String role = (current.getRole() == null ? "" : current.getRole().toUpperCase());
        boolean isAdmin = role.equals("ADMIN") || role.equals("SUPER_ADMIN");
        boolean isCompany = role.equals("COMPANY");
        boolean isAgent = role.equals("AGENT");
        boolean isUser = role.equals("USER");

        if (!isAdmin && !isCompany && !isAgent && !isUser) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Role not allowed to create properties");
        }

        // Area optional (keep support if you still want it)
        Area area = null;
        if (dto.getAreaId() != null) {
            area = areas.findById(dto.getAreaId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid areaId"));

            // If AGENT and you still want area-based access:
            if (isAgent) {
                boolean allowed = areaAccess.hasAccessToArea(current.getId(), dto.getAreaId());
                if (!allowed) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No access to this area");
            }
        }

        // COMPANY/AGENT must have company
        Company company = null;
        if (isCompany || isAgent) {
            company = current.getCompany();
            if (company == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Account has no company assigned");
            }
        }

        Property p = new Property();
        p.setTitle(dto.getTitle());
        p.setDescription(dto.getDescription());
        p.setPrice(dto.getPrice());
        p.setBedrooms(dto.getBedrooms());
        p.setBathrooms(dto.getBathrooms());
        p.setAddress1(dto.getAddress1());
        p.setCity(dto.getCity());
        p.setState(dto.getState());
        p.setZip(dto.getZip());
        p.setAreaSqft(dto.getAreaSqft());

        p.setLat(dto.getLat());
        p.setLng(dto.getLng());

        p.setPropertyType(dto.getPropertyType());
        p.setLocationTag(dto.getLocationTag());
        p.setYearBuilt(dto.getYearBuilt());

        p.setTenure(dto.getTenure());
        p.setLeaseStartDate(dto.getLeaseStartDate());
        p.setLeaseTermYears(dto.getLeaseTermYears());
        p.setLeaseExpiryDate(dto.getLeaseExpiryDate());

        p.setFloorPlans(joinCsv(dto.getFloorPlans()));
        p.setVirtualTours(joinCsv(dto.getVirtualTours()));
        p.setDocuments(joinCsv(dto.getDocuments()));

        String typeValue = dto.getType();
        if (typeValue == null || typeValue.isBlank()) typeValue = dto.getPropertyType();
        p.setType(typeValue);

        // ✅ Status rule for your latest flow:
        // everything except ADMIN goes to PENDING (admin approves)
        p.setStatus(isAdmin ? "APPROVED" : "PENDING");

        p.setOwner(current);
        p.setArea(area);

        // ✅ link company on property
        if (company != null) {
            p.setCompany(company);
        }

        // ✅ If AGENT creates the listing, auto-assign it to them
        if (isAgent) {
            p.setAssignedAgent(current);
        }

        autoGeocodeIfMissing(p);

        Property saved = properties.save(p);

        if (dto.getImages() != null) {
            int sort = 0;
            for (String url : dto.getImages()) {
                if (url == null || url.isBlank()) continue;
                PropertyImage img = new PropertyImage();
                img.setProperty(saved);
                img.setUrl(url);
                img.setSort(sort++);
                images.save(img);
            }
        }

        Map<String, Object> body = new HashMap<>();
        body.put("id", saved.getId());
        body.put("status", "ok");
        body.put("propertyStatus", saved.getStatus());
        return ResponseEntity.ok(body);
    }

    /* =========================================================
       STEP 3B: COMPANY assigns property to an AGENT
       - Property must belong to the same company
       ========================================================= */
    @PutMapping("/{id}/assign-agent/{agentId}")
    public ResponseEntity<Map<String, Object>> assignAgent(
            @PathVariable Long id,
            @PathVariable Long agentId
    ) {
        User current = getCurrentUser();

        String role = (current.getRole() == null ? "" : current.getRole().toUpperCase());
        boolean isAdmin = role.equals("ADMIN") || role.equals("SUPER_ADMIN");
        boolean isCompany = role.equals("COMPANY");

        if (!isAdmin && !isCompany) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only COMPANY/ADMIN can assign agents");
        }

        Property p = properties.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found"));

        User agent = users.findById(agentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agent not found"));

        if (!"AGENT".equalsIgnoreCase(agent.getRole())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected user is not an AGENT");
        }

        // ✅ Company security check (skip for admin)
        if (!isAdmin) {
            Company myCompany = current.getCompany();
            if (myCompany == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Your account has no company");
            }
            if (p.getCompany() == null || !p.getCompany().getId().equals(myCompany.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Property is not in your company");
            }
            if (agent.getCompany() == null || !agent.getCompany().getId().equals(myCompany.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Agent is not in your company");
            }
        }

        p.setAssignedAgent(agent);

        // keep status PENDING for admin approval
        if (p.getStatus() == null || p.getStatus().isBlank()) {
            p.setStatus("PENDING");
        }

        properties.save(p);

        Map<String, Object> body = new HashMap<>();
        body.put("status", "ok");
        body.put("propertyId", p.getId());
        body.put("assignedAgentId", agent.getId());
        return ResponseEntity.ok(body);
    }

    /* =========================================================
       DASHBOARD LIST
       - ADMIN: all
       - COMPANY: company properties
       - AGENT: ONLY assigned-to-me properties
       ========================================================= */
    @GetMapping("/dashboard")
    public Page<PropertyCardDto> dashboardList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status
    ) {
        User current = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        String role = (current.getRole() == null ? "" : current.getRole().toUpperCase());
        boolean isAdmin = role.equals("ADMIN") || role.equals("SUPER_ADMIN");
        boolean isCompany = role.equals("COMPANY");
        boolean isAgent = role.equals("AGENT");

        String statusFilter = (status == null || status.isBlank()) ? null : status.toUpperCase();

        if (isAdmin) {
            Page<Property> pageData = (statusFilter == null)
                    ? properties.findAll(pageable)
                    : properties.findByStatus(statusFilter, pageable);
            return pageData.map(this::toCardDtoWithStatus);
        }

        if (isCompany) {
            Company c = current.getCompany();
            if (c == null) return Page.empty(pageable);

            Page<Property> pageData = (statusFilter == null)
                    ? properties.findByCompany_Id(c.getId(), pageable)
                    : properties.findByCompany_IdAndStatus(c.getId(), statusFilter, pageable);  // ← fixed

            return pageData.map(this::toCardDtoWithStatus);
        }

        if (isAgent) {
            Page<Property> pageData = (statusFilter == null)
                    ? properties.findByAssignedAgent_Id(current.getId(), pageable)
                    : properties.findByAssignedAgent_IdAndStatus(current.getId(), statusFilter, pageable);

            return pageData.map(this::toCardDtoWithStatus);
        }

        return Page.empty(pageable);
    }

    /* =========================================================
       helpers
       ========================================================= */
    private PropertyCardDto toPublicCardDto(Property p) {
        PropertyCardDto dto = new PropertyCardDto();
        dto.id = p.getId();
        dto.title = p.getTitle();
        dto.city = p.getCity();
        dto.state = p.getState();
        dto.price = p.getPrice();
        dto.coverImageUrl = p.getImages().isEmpty() ? null : p.getImages().get(0).getUrl();
        dto.bedrooms = p.getBedrooms();
        dto.bathrooms = p.getBathrooms();
        dto.type = p.getType();
        dto.description = p.getDescription();

        if (p.getOwner() != null) {
            dto.ownerId = p.getOwner().getId();
            dto.ownerEmail = p.getOwner().getEmail();
            dto.ownerName = (p.getOwner().getName() != null && !p.getOwner().getName().isBlank())
                    ? p.getOwner().getName()
                    : p.getOwner().getEmail();
        }
        return dto;
    }

    private PropertyCardDto toCardDtoWithStatus(Property p) {
        PropertyCardDto dto = toPublicCardDto(p);
        dto.status = p.getStatus();
        dto.declineReason = p.getDeclineReason(); // ← add this line
        return dto;
    }
    

    private String joinCsv(List<String> list) {
        if (list == null || list.isEmpty()) return null;
        return String.join(",", list);
    }

    private List<String> splitCsv(String csv) {
        List<String> res = new ArrayList<>();
        if (csv == null || csv.isBlank()) return res;
        for (String part : csv.split(",")) {
            String t = part.trim();
            if (!t.isEmpty()) res.add(t);
        }
        return res;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not logged in");
        }
        String email = auth.getName();

        // IMPORTANT: make sure this query fetches company too if LAZY
        // If you only have findByEmailWithAreas() now, it’s still okay as long as company is not needed immediately.
        return users.findByEmailWithAreas(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private void autoGeocodeIfMissing(Property p) {
        if (p.getLat() != null && p.getLng() != null) return;
        if (googleMapsApiKey == null || googleMapsApiKey.isBlank()) return;

        StringBuilder sb = new StringBuilder();
        if (p.getAddress1() != null && !p.getAddress1().isBlank()) sb.append(p.getAddress1()).append(", ");
        if (p.getCity() != null && !p.getCity().isBlank()) sb.append(p.getCity()).append(", ");
        if (p.getState() != null && !p.getState().isBlank()) sb.append(p.getState()).append(", ");
        if (p.getZip() != null && !p.getZip().isBlank()) sb.append(p.getZip());

        String address = sb.toString().replaceAll(", $", "").trim();
        if (address.isEmpty()) return;

        try {
            String encodedAddress = URLEncoder.encode(address, StandardCharsets.UTF_8);
            String url = "https://maps.googleapis.com/maps/api/geocode/json?address="
                    + encodedAddress + "&key=" + googleMapsApiKey;

            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) return;

            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(response.body());
            if (!"OK".equals(json.path("status").asText())) return;

            JsonNode location = json.path("results").path(0).path("geometry").path("location");
            p.setLat(location.path("lat").asDouble());
            p.setLng(location.path("lng").asDouble());
        } catch (Exception ignored) {}
    }
    
    @GetMapping("/mine")
    public Page<PropertyCardDto> mine(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        User current = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return properties.findByOwnerId(current.getId(), pageable)
                         .map(this::toCardDtoWithStatus);
    }
    
    @PutMapping("/{id}/advanced")
    public ResponseEntity<Map<String, Object>> updateAdvanced(
            @PathVariable Long id,
            @RequestBody Map<String, Object> dto
    ) {
        User current = getCurrentUser();

        Property p = properties.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found"));

        // Only owner, admin, or assigned agent can update
        String role = (current.getRole() == null ? "" : current.getRole().toUpperCase());
        boolean isAdmin = role.equals("ADMIN") || role.equals("SUPER_ADMIN");
        boolean isOwner = p.getOwner() != null && p.getOwner().getId().equals(current.getId());
        boolean isAssigned = p.getAssignedAgent() != null && p.getAssignedAgent().getId().equals(current.getId());

        if (!isAdmin && !isOwner && !isAssigned) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to update this property");
        }

        if (dto.containsKey("tenure")) p.setTenure((String) dto.get("tenure"));
        if (dto.containsKey("leaseStartDate") && dto.get("leaseStartDate") != null)
            p.setLeaseStartDate(java.time.LocalDate.parse((String) dto.get("leaseStartDate")));
        if (dto.containsKey("leaseTermYears") && dto.get("leaseTermYears") != null)
            p.setLeaseTermYears(((Number) dto.get("leaseTermYears")).intValue());
        if (dto.containsKey("leaseExpiryDate") && dto.get("leaseExpiryDate") != null)
            p.setLeaseExpiryDate(java.time.LocalDate.parse((String) dto.get("leaseExpiryDate")));

        if (dto.containsKey("floorPlans"))
            p.setFloorPlans(joinCsv((List<String>) dto.get("floorPlans")));
        if (dto.containsKey("virtualTours"))
            p.setVirtualTours(joinCsv((List<String>) dto.get("virtualTours")));
        if (dto.containsKey("documents"))
            p.setDocuments(joinCsv((List<String>) dto.get("documents")));

        properties.save(p);

        Map<String, Object> body = new HashMap<>();
        body.put("status", "ok");
        body.put("id", p.getId());
        return ResponseEntity.ok(body);
    }
}