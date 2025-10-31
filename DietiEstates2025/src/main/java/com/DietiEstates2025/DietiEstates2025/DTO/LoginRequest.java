package com.DietiEstates2025.DietiEstates2025.DTO;

public class LoginRequest {
    private String username;
    private String password;

    // Costruttore vuoto
    public LoginRequest() {}

    // Getter e Setter
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
