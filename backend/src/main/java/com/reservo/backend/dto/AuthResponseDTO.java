package com.reservo.backend.dto;

import com.reservo.backend.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDTO {
    private String token;
    private String type;
    private String id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String loginProvider;
    private List<User.ProviderInfo> providerData;
}
