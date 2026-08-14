package com.reservo.backend.security;

import com.reservo.backend.entity.User;
import com.reservo.backend.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;
import java.time.Instant;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        String provider = oauthToken.getAuthorizedClientRegistrationId().toUpperCase();
        
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        // Extract email (Microsoft uses preferred_username or mail, Apple/Google use email)
        String email = oAuth2User.getAttribute("email");
        if (email == null) {
            email = oAuth2User.getAttribute("preferred_username");
        }
        if (email == null) {
            email = oAuth2User.getAttribute("mail");
        }

        // Apple only sends email on the first login. 
        // If it's missing, use a fallback based on their unique subject ID.
        if (email == null && "APPLE".equals(provider)) {
            String sub = oAuth2User.getAttribute("sub");
            if (sub != null) {
                email = "apple_" + sub + "@apple-login.local";
            }
        }

        String name = oAuth2User.getAttribute("name");
        
        if (email == null) {
            log.error("OAuth2 user does not have an email address");
            response.sendRedirect("http://localhost:5173/login?error=oauth_email_missing");
            return;
        }

        // Find or create user
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        
        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Update provider info if logging in via a different OAuth provider
            if (!provider.equals(user.getLoginProvider())) {
                user.setLoginProvider(provider);
                userRepository.save(user);
            }
        } else {
            // Register new user with random password
            String randomPassword = UUID.randomUUID().toString();
            
            user = User.builder()
                    .name(name != null ? name : "Guest User")
                    .email(email)
                    .passwordHash(passwordEncoder.encode(randomPassword))
                    .role(User.Role.ROLE_CUSTOMER)
                    .status(User.UserStatus.ACTIVE)
                    .loginProvider(provider)
                    .emailVerified(true)
                    .lastLoginAt(Instant.now())
                    .build();
            user = userRepository.save(user);
        }

        // Generate JWT token
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        // Redirect to frontend with token
        String targetUrl = "http://localhost:5173/oauth2/redirect?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
