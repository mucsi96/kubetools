FROM maven:3-eclipse-temurin-17 as builder
WORKDIR /workspace/app

COPY pom.xml .
COPY src src

RUN mvn package -DskipTests -B -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)





FROM bellsoft/liberica-openjre-alpine-musl:17
WORKDIR /workspace/app

VOLUME /tmp

ARG DEPENDENCY=/workspace/app/target/dependency

COPY --from=build ${DEPENDENCY}/BOOT-INF/lib lib
COPY --from=build ${DEPENDENCY}/META-INF META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes .

ENTRYPOINT ["java", "-classpath", "app:app/lib/*", "-Dspring.profiles.active=prod", "io.github.mucsi96.demo.Application"]