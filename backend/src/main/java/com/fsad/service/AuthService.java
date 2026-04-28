package com.fsad.service;

import com.fsad.auth.JwtService;
import com.fsad.dto.AuthResponse;
import com.fsad.dto.LoginRequest;
import com.fsad.dto.RegisterRequest;
import com.fsad.model.Role;
import com.fsad.model.UserAccount;
import com.fsad.repository.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private final UserAccountRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserAccountRepository userRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        Role role = request.getRole() == null ? Role.BORROWER : Role.from(request.getRole());
        UserAccount user = createUser(request.getName(), request.getEmail(), request.getPassword(), role);
        return new AuthResponse(toSafeUser(user), jwtService.generateToken(user));
    }

    public Map<String, Object> createUserByAdmin(String name, String email, String password, String role) {
        UserAccount user = createUser(name, email, password, Role.from(role));
        return toSafeUser(user);
    }

    public List<Map<String, Object>> listUsers() {
        return userRepository.findAll().stream().map(this::toSafeUser).toList();
    }

    public Map<String, Object> updateUserByAdmin(String userId, String name, String email, String role, String password) {
        UserAccount user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String normalizedEmail = email.toLowerCase(Locale.ROOT).trim();
        userRepository.findByEmailIgnoreCase(normalizedEmail)
                .filter(existing -> !existing.getId().equals(userId))
                .ifPresent(existing -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
                });

        user.setName(name.trim());
        user.setEmail(normalizedEmail);
        user.setRole(Role.from(role));

        if (password != null && !password.isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(password));
        }

        return toSafeUser(userRepository.save(user));
    }

    public void deleteUserByAdmin(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        userRepository.deleteById(userId);
    }

    public AuthResponse login(LoginRequest request) {
        UserAccount user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        if (request.getRole() != null && !request.getRole().isBlank() && !user.getRole().toApiValue().equals(request.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Selected role does not match your account role");
        }

        return new AuthResponse(toSafeUser(user), jwtService.generateToken(user));
    }

    public Map<String, Object> getUserById(String userId) {
        UserAccount user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid user token"));
        return toSafeUser(user);
    }

    public Map<String, Object> toSafeUser(UserAccount user) {
        Map<String, Object> safeUser = new LinkedHashMap<>();
        safeUser.put("id", user.getId());
        safeUser.put("name", user.getName());
        safeUser.put("email", user.getEmail());
        safeUser.put("role", user.getRole().toApiValue());
        safeUser.put("status", "active");
        return safeUser;
    }

    private UserAccount createUser(String name, String email, String password, Role role) {
        String normalizedEmail = email.toLowerCase(Locale.ROOT).trim();
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        UserAccount user = new UserAccount(
                "U-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT),
                name.trim(),
                normalizedEmail,
                role,
                passwordEncoder.encode(password)
        );
        return userRepository.save(user);
    }
}
