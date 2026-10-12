# Multi-Stage Dockerfile for Spring Boot Enterprise Backend
# Stage 1: Build JAR package
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /app

COPY backend/pom.xml ./pom.xml
COPY backend/src ./src

RUN mvn clean package -DskipTests

# Stage 2: Runtime image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Run container as non-root user
RUN addgroup -S helpdesk && adduser -S helpdesk -G helpdesk

COPY --from=builder /app/target/*.jar app.jar

USER helpdesk

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/api/tickets || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
