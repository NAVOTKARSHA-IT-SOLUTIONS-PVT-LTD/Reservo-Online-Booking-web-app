package com.reservo.backend.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class FirebaseService {

    /**
     * Verify Firebase ID token and return the decoded token
     * @param idToken Firebase ID token from client
     * @return Decoded Firebase token
     * @throws RuntimeException if verification fails
     */
    public FirebaseToken verifyIdToken(String idToken) {
        try {
            return FirebaseAuth.getInstance().verifyIdToken(idToken);
        } catch (FirebaseAuthException e) {
            log.error("Firebase token verification failed: {}", e.getMessage());
            throw new RuntimeException("Invalid Firebase token: " + e.getMessage());
        }
    }

    /**
     * Extract phone number from Firebase token
     * @param idToken Firebase ID token
     * @return Phone number or null if not present
     */
    public String getPhoneNumberFromToken(String idToken) {
        try {
            FirebaseToken decodedToken = verifyIdToken(idToken);
            // Phone number is in the claims for phone auth
            Object phoneNumber = decodedToken.getClaims().get("phone_number");
            return phoneNumber != null ? phoneNumber.toString() : null;
        } catch (Exception e) {
            log.error("Failed to extract phone number from token: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Check if Firebase is properly initialized
     * @return true if Firebase is available
     */
    public boolean isFirebaseAvailable() {
        try {
            FirebaseAuth.getInstance();
            return true;
        } catch (Exception e) {
            log.warn("Firebase is not available: {}", e.getMessage());
            return false;
        }
    }
}