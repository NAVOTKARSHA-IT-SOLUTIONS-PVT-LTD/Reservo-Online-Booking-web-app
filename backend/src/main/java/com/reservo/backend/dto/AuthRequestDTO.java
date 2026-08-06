package com.reservo.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthRequestDTO {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private String name; // Required for signup
    private String phone;
    private String role; // e.g. "ROLE_CUSTOMER", "ROLE_OWNER"
}
