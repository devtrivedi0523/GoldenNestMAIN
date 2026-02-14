package com.Backend.GoldenNest.security;

import com.Backend.GoldenNest.modal.User;
import com.Backend.GoldenNest.repository.UserRepository;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class AreaAccessService {

    private final UserRepository userRepository;

    public AreaAccessService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Returns true if user is SUPER_ADMIN or assigned to the given areaId.
     */
    public boolean hasAccessToArea(Long userId, Long areaId) {
        Optional<User> opt = userRepository.findByIdWithAreas(userId);
        if (opt.isEmpty()) return false;
        User user = opt.get();
        String role = user.getRole();
        if (role != null && (role.equalsIgnoreCase("SUPER_ADMIN") || role.equalsIgnoreCase("ADMIN"))) {
            return true;
        }
        return user.getAreas().stream().anyMatch(a -> a.getId().equals(areaId));
    }
}
