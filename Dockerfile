FROM eclipse-temurin:17-jdk-alpine

RUN apk add --no-cache \
    nodejs \
    npm \
    maven \
    bash \
    supervisor

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

WORKDIR /app/backend

COPY backend/HospitalManagementSystem/pom.xml ./
RUN mvn dependency:go-offline

COPY backend/HospitalManagementSystem/ .
RUN mvn clean package -DskipTests

WORKDIR /app

RUN cp /app/backend/target/*.jar /app/app.jar

RUN mkdir -p /app/static && cp -r /app/frontend/dist/* /app/static/

RUN mkdir -p /docker-entrypoint-initdb.d
COPY database/hospital.sql /docker-entrypoint-initdb.d/

RUN apk add --no-cache mariadb mariadb-client
RUN mkdir -p /var/lib/mysql /run/mysqld \
 && chown -R mysql:mysql /var/lib/mysql /run/mysqld

ENV MYSQL_ROOT_PASSWORD=root
ENV SPRING_PROFILES_ACTIVE=docker

COPY supervisord.conf /etc/supervisord.conf

EXPOSE 3000 8081 3306

ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]