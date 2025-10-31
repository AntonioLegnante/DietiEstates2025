package com.DietiEstates2025.DietiEstates2025.DTO;

public class LoginResponse {
    private String token;       // Il JWT
    private String type;        // "Bearer"
    private String username;    // L'username dell'utente

    public LoginResponse(String token, String username) {
        this.token = token;
        this.type = "Bearer";
        this.username = username;
    }

    // Getter e Setter
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}