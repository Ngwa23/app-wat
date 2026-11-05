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
# Run as a non-root user
RUN addgroup -S wat && adduser -S wat -G wat
COPY --from=build /app/target/app-wat.jar app.jar
RUN chown -R wat:wat /app
USER wat

EXPOSE 7070
# Make the app listen on 7070 to match EXPOSE / HEALTHCHECK and the k8s manifests.
# (application.yml defaults to 7070 via ${PORT:7070} when this is unset.)
ENV PORT=7070
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:+UseG1GC"
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s \
  CMD wget -qO- http://localhost:7070/actuator/health | grep -q UP || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
