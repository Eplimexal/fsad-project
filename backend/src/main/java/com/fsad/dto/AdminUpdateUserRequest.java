package com.fsad.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AdminUpdateUserRequest {

    @NotBlank(message = "is required")
    @Size(min = 2, max = 80, message = "must be between 2 and 80 characters")
    private String name;

    @NotBlank(message = "is required")
    @Email(message = "must be a valid email")
    private String email;

    @NotBlank(message = "is required")
    @Pattern(regexp = "admin|lender|borrower|analyst", message = "must be one of admin, lender, borrower, analyst")
    private String role;

    @Size(min = 6, max = 64, message = "must be between 6 and 64 characters")
    private String password;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
