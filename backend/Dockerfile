FROM maven:3.9.6-eclipse-temurin-17

WORKDIR /app

# Copy entire project
COPY HospitalManagementSystem/ .

# Build the Spring Boot application
RUN mvn clean package -DskipTests

# Rename the JAR to a fixed name
RUN cp target/*.jar app.jar

# Expose backend port
EXPOSE 8081

# Run the application
CMD ["java", "-jar", "app.jar"]
