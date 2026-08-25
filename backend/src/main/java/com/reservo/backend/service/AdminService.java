package com.reservo.backend.service;

import com.reservo.backend.exception.ResourceNotFoundException;
import com.reservo.backend.entity.*;
import com.reservo.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ResortRepository resortRepository;
    private final BookingRepository bookingRepository;
    private final PlatformSettingRepository platformSettingRepository;
    private final AdminAuditLogRepository adminAuditLogRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User updateUserStatus(Long userId, User.UserStatus status, String adminUsername) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        user.setStatus(status);
        logAudit(adminUsername, "UPDATE_USER_STATUS", "User", String.valueOf(userId), "Updated user status to " + status);
        return userRepository.save(user);
    }

    public List<Resort> getPendingResorts() {
        return resortRepository.findByStatus(Resort.ResortStatus.PENDING_APPROVAL);
    }

    public List<Resort> getAllResorts() {
        return resortRepository.findAll();
    }

    @Transactional
    public Resort updateResortStatus(Long resortId, Resort.ResortStatus status, String adminUsername) {
        Resort resort = resortRepository.findById(resortId)
                .orElseThrow(() -> new ResourceNotFoundException("Resort not found with ID: " + resortId));
        resort.setStatus(status);
        
        if (status == Resort.ResortStatus.APPROVED && resort.getOwner() != null) {
            User owner = resort.getOwner();
            if (owner.getRole() == User.Role.ROLE_CUSTOMER) {
                owner.setRole(User.Role.ROLE_OWNER);
                userRepository.save(owner);
            }
        }
        
        logAudit(adminUsername, "UPDATE_RESORT_STATUS", "Resort", String.valueOf(resortId), "Updated resort status to " + status);
        return resortRepository.save(resort);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Transactional
    public Booking cancelBookingByAdmin(Long bookingId, String adminUsername) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        logAudit(adminUsername, "CANCEL_BOOKING", "Booking", String.valueOf(bookingId), "Admin cancelled booking " + booking.getBookingCode());
        return bookingRepository.save(booking);
    }

    public List<AdminAuditLog> getRecentAuditLogs() {
        return adminAuditLogRepository.findTop20ByOrderByTimestampDesc();
    }

    public void logAudit(String adminUsername, String action, String targetEntity, String targetId, String details) {
        AdminAuditLog log = AdminAuditLog.builder()
                .adminUsername(adminUsername != null ? adminUsername : "SYSTEM_ADMIN")
                .action(action)
                .targetEntity(targetEntity)
                .targetId(targetId)
                .details(details)
                .build();
        adminAuditLogRepository.save(log);
    }
}
