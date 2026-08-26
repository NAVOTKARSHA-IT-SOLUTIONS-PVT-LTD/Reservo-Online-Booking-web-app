package com.reservo.backend.service;

import com.reservo.backend.entity.User;
import com.reservo.backend.entity.Resort;
import com.reservo.backend.exception.ResourceNotFoundException;
import com.reservo.backend.repository.UserRepository;
import com.reservo.backend.repository.ResortRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ResortRepository resortRepository;
    private final PasswordEncoder passwordEncoder;

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Transactional(readOnly = true)
    public List<User> getPendingHosts() {
        return userRepository.findByKycStatus(User.KycStatus.PENDING_VERIFICATION);
    }

    @Transactional
    public void approveResortsForUser(User user) {
        List<Resort> userResorts = resortRepository.findByOwnerId(user.getId());
        for (Resort resort : userResorts) {
            resort.setStatus(Resort.ResortStatus.APPROVED);
            resortRepository.save(resort);
        }
    }

    @Transactional
    public User updateProfile(String email, String name, String phone) {
        User user = getUserByEmail(email);
        user.setName(name);
        user.setPhone(phone);
        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = getUserByEmail(email);
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Incorrect current password");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
