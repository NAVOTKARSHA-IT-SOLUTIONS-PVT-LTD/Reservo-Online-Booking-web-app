package com.reservo.backend.config;

import com.google.firebase.FirebaseApp;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

/**
 * Custom Spring Boot Actuator HealthIndicator for Firebase & Firestore connectivity.
 * Reports live health state to /actuator/health for Docker/Kubernetes container orchestration.
 */
@Slf4j
@Component
public class FirestoreHealthIndicator implements HealthIndicator {

    @Override
    public Health health() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                return Health.down()
                        .withDetail("service", "Firebase/Firestore")
                        .withDetail("status", "NOT_INITIALIZED")
                        .withDetail("message", "No active FirebaseApp instance found.")
                        .build();
            }

            FirebaseApp app = FirebaseApp.getInstance();
            String projectId = app.getOptions().getProjectId();

            return Health.up()
                    .withDetail("service", "Firebase/Firestore")
                    .withDetail("status", "CONNECTED")
                    .withDetail("appName", app.getName())
                    .withDetail("projectId", projectId != null ? projectId : "configured")
                    .build();

        } catch (Exception e) {
            log.error("Health check error while verifying Firebase status: {}", e.getMessage());
            return Health.down(e)
                    .withDetail("service", "Firebase/Firestore")
                    .withDetail("status", "ERROR")
                    .build();
        }
    }
}
