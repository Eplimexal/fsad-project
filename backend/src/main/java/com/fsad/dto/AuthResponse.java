package com.fsad.dto;

import java.util.Map;

public class AuthResponse {
    private Map<String, Object> user;
    private String token;

    public AuthResponse() {}

    public AuthResponse(Map<String, Object> user, String token) {
        this.user = user;
        this.token = token;
    }

    public Map<String, Object> getUser() { return user; }
    public void setUser(Map<String, Object> user) { this.user = user; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
