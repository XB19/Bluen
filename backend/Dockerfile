FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -q -B dependency:go-offline
COPY src src
RUN ./mvnw -q -B package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
RUN useradd --system --uid 1001 bluen \
    && mkdir -p /data/uploads /data/uploads-private \
    && chown -R bluen /data
COPY --from=build /app/target/*.jar app.jar
USER bluen
ENV UPLOADS_DIR=/data/uploads \
    PRIVATE_DIR=/data/uploads-private
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
