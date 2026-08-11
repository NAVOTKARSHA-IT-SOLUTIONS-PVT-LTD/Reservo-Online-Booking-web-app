package com.reservo.backend.config;

import com.reservo.backend.security.CustomUserDetailsService;
import com.reservo.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.cors.allowed-origins:http://localhost:5173}")
    private List<String> allowedOrigins;

    /**
     * Argon2id Password Encoder with secure parameters for production use.
     * Parameters based on OWASP recommendations (2024):
     * - Memory: 64MB (65536 KB) - balances security and performance
     * - Parallelism: 4 threads - utilizes modern multi-core processors
     * - Iterations: 3 - provides adequate computational cost
     * - Hash length: 32 bytes (256 bits) - standard for Argon2id
     * - Salt length: 16 bytes (128 bits) - sufficient for unique salts
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new Argon2PasswordEncoder(
            16,  // salt length
            32,  // hash length
            3,   // iterations
            65536, // memory (64MB)
            4    // parallelism
        );
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/v1/auth/login", "/api/v1/auth/signup", "/api/v1/auth/otp/**", "/api/v1/auth/password-reset/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/v1/resorts/**", "/api/v1/offers/**", "/api/v1/rooms/**", "/api/v1/reviews/**", "/api/v1/availability/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/ai/chat", "/api/v1/ai/itinerary").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/resorts/**", "/api/v1/rooms/**").hasAnyRole("OWNER", "ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/v1/rooms/**").hasAnyRole("OWNER", "ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/v1/documents/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/staff/**", "/api/v1/documents/**").hasAnyRole("OWNER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/v1/offers/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/offers/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/bookings/**", "/api/v1/wishlist/**", "/api/v1/user/**", "/api/v1/reviews/**").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp.policyDirectives(
                    "default-src 'self'; " +
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
                    "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
                    "img-src 'self' data: https://images.unsplash.com; " +
                    "media-src 'self' https://player.vimeo.com https://*.vimeo.com; " +
                    "connect-src 'self'; " +
                    "frame-ancestors 'none';"
                ))
                .frameOptions(frame -> frame.deny())
                .httpStrictTransportSecurity(hsts -> hsts
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31536000)
                )
                .referrerPolicy(referrer -> referrer
                    .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER_WHEN_DOWNGRADE)
                )
            );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
