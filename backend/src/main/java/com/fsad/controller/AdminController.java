package com.fsad.controller;

import com.fsad.dto.AdminCreateUserRequest;
import com.fsad.dto.AdminUpdateUserRequest;
import com.fsad.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AuthService authService;

    public AdminController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/users")
    public List<Map<String, Object>> getUsers() {
        return authService.listUsers();
    }

    @PostMapping("/users")
    public Map<String, Object> createUser(@Valid @RequestBody AdminCreateUserRequest request) {
        return authService.createUserByAdmin(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getRole()
        );
    }

    @PutMapping("/users/{userId}")
    public Map<String, Object> updateUser(@PathVariable String userId, @Valid @RequestBody AdminUpdateUserRequest request) {
        return authService.updateUserByAdmin(
                userId,
                request.getName(),
                request.getEmail(),
                request.getRole(),
                request.getPassword()
        );
    }

    @DeleteMapping("/users/{userId}")
    public void deleteUser(@PathVariable String userId) {
        authService.deleteUserByAdmin(userId);
    }
}
