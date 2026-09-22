# ==========================================================
# Multi-Stage Dockerfile for Backend Service (Render / Railway)
# ==========================================================

# Stage 1: Build JAR with Maven Wrapper
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY src src

RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# Stage 2: Minimal Production JRE Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Non-root user for security
RUN addgroup -S helpdesk && adduser -S helpdesk -G helpdesk
USER helpdesk

COPY --from=builder /app/target/ai-it-helpdesk-system-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
