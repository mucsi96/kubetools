FROM bellsoft/liberica-runtime-container:jdk-17-stream-musl as builder
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN ./mvnw package -DskipTests -B -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn





FROM bellsoft/alpaquita-linux-base:stream-musl-230404
VOLUME /tmp
WORKDIR /workspace/app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=builder /workspace/app/target/*.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]