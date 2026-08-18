package com.reservo.backend.repository;

import com.reservo.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByProviderUserId(String providerUserId);
    boolean existsByEmail(String email);
    long countByRole(User.Role role);
    long countByStatus(User.UserStatus status);
}
