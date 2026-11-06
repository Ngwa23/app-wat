# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
# Cache dependencies first
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
# Build the application
COPY src ./src
RUN mvn -q -B clean package -DskipTests

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Run as a non-root user with a FIXED NUMERIC uid/gid. A numeric USER lets
# Kubernetes verify runAsNonRoot without a runAsUser override; a named user
# there causes CreateContainerConfigError.
RUN addgroup -S -g 1001 wat && adduser -S -u 1001 -G wat wat
COPY --from=build /app/target/app-wat.jar app.jar
RUN chown -R 1001:1001 /app
USER 1001

EXPOSE 9090
# Make the app listen on 9090 to match EXPOSE / HEALTHCHECK and the k8s manifests.
# (application.yml defaults to 9090 via ${PORT:9090} when this is unset.)
ENV PORT=9090
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:+UseG1GC"
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s \
  CMD wget -qO- http://localhost:9090/actuator/health | grep -q UP || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
