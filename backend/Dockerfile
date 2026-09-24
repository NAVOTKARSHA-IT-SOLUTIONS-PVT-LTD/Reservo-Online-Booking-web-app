# ============================================================
# RESERVO BACKEND - ENTERPRISE MULTI-STAGE DOCKERFILE
# Stage 1: Build Application
# Stage 2: Minimal Distroless/Alpine Runtime with Non-Root User
# ============================================================

# --- Stage 1: Build Environment ---
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /build

# Cache Maven dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build production artifact
COPY src ./src
RUN mvn clean package -DskipTests -B

# --- Stage 2: Production JRE Runtime ---
FROM eclipse-temurin:17-jre-alpine AS runner
WORKDIR /app

# Install security updates and utilities for health checking
RUN apk --no-cache add wget tzdata \
    && addgroup -g 10001 -S spring \
    && adduser -u 10001 -S spring -G spring

# Create required directories for logs and persistent media
RUN mkdir -p /app/logs /app/uploads/media \
    && chown -R spring:spring /app

# Copy executable jar from builder stage
COPY --from=builder --chown=spring:spring /build/target/*.jar /app/app.jar

# Drop root privileges
USER spring:spring

# Expose standard Spring Boot HTTP port
EXPOSE 8080

# Production Container Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD wget -qO- http://localhost:8080/actuator/health | grep -q 'UP' || exit 1

# Container-aware JVM memory configuration
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError -Djava.security.egd=file:/dev/./urandom"
ENV SPRING_PROFILES_ACTIVE="prod"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
