package com.reservo.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.service.account.json:}")
    private String firebaseServiceAccountJson;

    @PostConstruct
    public void initializeFirebase() {
        try {
            if (firebaseServiceAccountJson != null && !firebaseServiceAccountJson.isEmpty()) {
                // Initialize Firebase with service account JSON from environment variable
                ByteArrayInputStream serviceAccountStream = new ByteArrayInputStream(
                    firebaseServiceAccountJson.getBytes(StandardCharsets.UTF_8)
                );

                FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccountStream))
                    .build();

                if (FirebaseApp.getApps().isEmpty()) {
                    FirebaseApp.initializeApp(options);
                    System.out.println("Firebase initialized successfully");
                }
            } else {
                System.out.println("Firebase service account JSON not provided. Firebase features will be disabled.");
            }
        } catch (IOException e) {
            System.err.println("Failed to initialize Firebase: " + e.getMessage());
            // Don't throw exception to allow application to start without Firebase
        }
    }
}