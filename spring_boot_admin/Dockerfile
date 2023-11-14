FROM maven:3-eclipse-temurin-17 as builder
WORKDIR /workspace/app

COPY pom.xml .
COPY src src

RUN mvn package -DskipTests -B -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn




FROM bellsoft/liberica-runtime-container:jre-17-stream-musl
VOLUME /tmp
WORKDIR /workspace/app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=builder /workspace/app/target/*.jar app.jar

EXPOSE 8099
CMD ["java", "-jar", "app.jar"]