package com.reservo.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reservo.backend.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class RateLimitingInterceptor implements HandlerInterceptor {

    private final Map<String, TokenBucket> ipBuckets = new ConcurrentHashMap<>();
    private final ScheduledExecutorService cleanupExecutor = Executors.newSingleThreadScheduledExecutor();
    
    // Limits: 5 requests max, refilling at 1 request every 12 seconds (5 per minute)
    private static final long BUCKET_CAPACITY = 5;
    private static final double REFILL_RATE_PER_SECOND = 1.0 / 12.0;
    private static final long CLEANUP_INTERVAL_MINUTES = 30;

    @Value("${app.rate-limit.places.requests-per-minute:10}")
    private long placesRequestsPerMinute;

    public RateLimitingInterceptor() {
        // Schedule periodic cleanup of old IP buckets to prevent memory leaks
        cleanupExecutor.scheduleAtFixedRate(this::cleanupOldBuckets, 
            CLEANUP_INTERVAL_MINUTES, CLEANUP_INTERVAL_MINUTES, TimeUnit.MINUTES);
    }

    private void cleanupOldBuckets() {
        // Remove buckets that are empty (refilled and not being used)
        ipBuckets.entrySet().removeIf(entry -> {
            TokenBucket bucket = entry.getValue();
            return bucket.getTokens() >= bucket.getCapacity() && 
                   System.currentTimeMillis() - bucket.getLastUsed() > TimeUnit.MINUTES.toMillis(CLEANUP_INTERVAL_MINUTES);
        });
        if (!ipBuckets.isEmpty()) {
            log.debug("Cleaned up rate limit buckets. Active buckets: {}", ipBuckets.size());
        }
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String clientIp = getClientIp(request);
        String path = request.getRequestURI();

        if (path.startsWith("/api/v1/places/")) {
            TokenBucket bucket = ipBuckets.computeIfAbsent("places:" + clientIp,
                    ip -> new TokenBucket(placesRequestsPerMinute, placesRequestsPerMinute / 60.0));
            if (!bucket.tryConsume()) {
                log.warn("Places rate limit exceeded for client IP {}", clientIp);
                writeTooManyRequests(response, "Too many place requests. Please wait a minute and try again.");
                return false;
            }
        } else if (path.contains("/api/v1/auth/otp/") || path.contains("/api/v1/auth/login") || path.contains("/api/v1/auth/password-reset/")) {
            TokenBucket bucket = ipBuckets.computeIfAbsent(clientIp, ip -> new TokenBucket(BUCKET_CAPACITY, REFILL_RATE_PER_SECOND));

            if (!bucket.tryConsume()) {
                log.warn("Rate limit exceeded for IP: {} requesting path: {}", clientIp, path);
                
                writeTooManyRequests(response, "Too many requests. Please try again later.");
                return false;
            }
        }
        return true;
    }

    private void writeTooManyRequests(HttpServletResponse response, String message) throws Exception {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        ApiResponse<String> apiResponse = ApiResponse.error(message, 429);
        response.getWriter().write(new ObjectMapper().writeValueAsString(apiResponse));
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isBlank()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
