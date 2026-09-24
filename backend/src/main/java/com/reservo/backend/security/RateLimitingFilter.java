package com.reservo.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Production-grade In-Memory Rate Limiting Filter to prevent brute-force attacks,
 * credential stuffing, and API flooding on authentication and transactional routes.
 */
@Slf4j
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int AUTH_REQUESTS_PER_MINUTE = 15;
    private static final int GENERAL_REQUESTS_PER_MINUTE = 200;
    private static final long WINDOW_MS = 60_000L; // 1 minute window

    private final ConcurrentHashMap<String, RequestBucket> clientBuckets = new ConcurrentHashMap<>();
    private volatile long lastPurgeTimestamp = System.currentTimeMillis();

    private static class RequestBucket {
        long windowStart;
        final AtomicInteger count = new AtomicInteger(0);

        RequestBucket(long windowStart) {
            this.windowStart = windowStart;
            this.count.set(1);
        }

        boolean allow(int maxLimit, long now) {
            if (now - windowStart > WINDOW_MS) {
                windowStart = now;
                count.set(1);
                return true;
            }
            return count.incrementAndGet() <= maxLimit;
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Periodic cleanup of stale IP buckets every 5 minutes to prevent memory accumulation
        long now = System.currentTimeMillis();
        if (now - lastPurgeTimestamp > 300_000L) {
            lastPurgeTimestamp = now;
            clientBuckets.entrySet().removeIf(entry -> (now - entry.getValue().windowStart) > WINDOW_MS * 2);
        }

        String path = request.getRequestURI();

        // Bypass Actuator health and static media endpoints from strict rate limits
        if (path.startsWith("/actuator") || path.startsWith("/swagger-ui") || path.startsWith("/v3/api-docs") || path.startsWith("/api/v1/media/files")) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = extractClientIp(request);
        boolean isAuthRoute = isAuthOrSensitiveRoute(path);
        int maxLimit = isAuthRoute ? AUTH_REQUESTS_PER_MINUTE : GENERAL_REQUESTS_PER_MINUTE;
        String bucketKey = (isAuthRoute ? "auth:" : "gen:") + clientIp;

        RequestBucket bucket = clientBuckets.compute(bucketKey, (k, existing) -> {
            if (existing == null) {
                return new RequestBucket(now);
            }
            return existing;
        });

        if (!bucket.allow(maxLimit, now)) {
            log.warn("Rate limit exceeded for IP: {} on URI: {} (Limit: {}/min)", clientIp, path, maxLimit);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setHeader("Retry-After", "60");
            response.getWriter().write(String.format(
                    "{\"success\":false,\"message\":\"Too many requests. Please wait 1 minute before trying again.\",\"data\":null,\"errors\":[\"Rate limit of %d requests/minute exceeded\"],\"timestamp\":%d}",
                    maxLimit, now
            ));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isAuthOrSensitiveRoute(String uri) {
        return uri.startsWith("/api/v1/auth/login")
                || uri.startsWith("/api/v1/auth/signup")
                || uri.startsWith("/api/v1/auth/register")
                || uri.startsWith("/api/v1/auth/otp")
                || uri.startsWith("/api/v1/auth/phone")
                || uri.startsWith("/api/v1/auth/forgot-password")
                || uri.startsWith("/api/v1/auth/reset-password")
                || uri.startsWith("/api/v1/payments/create-checkout");
    }

    private String extractClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }
        return request.getRemoteAddr();
    }
}
