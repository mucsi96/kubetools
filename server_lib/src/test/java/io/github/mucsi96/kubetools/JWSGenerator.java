package io.github.mucsi96.kubetools;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPublicKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Base64.Encoder;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JOSEObjectType;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.SneakyThrows;

@Component
public class JWSGenerator {
    private static final String KEY_ID_VALUE = "dummy_key_id";
    private static final String CONFIGURED_ISSUER_VALUE = "dummy_issuer_uri";
    private static final String CONFIGURED_AUDIENCE_VALUE = "dummy_client_id";
    private static final String VALID_SUBJECT_VALUE = "VALID SUBJECT VALUE";
    private final KeyPair keyPair;
    private final String jwksKeySetJson;

    public JWSGenerator() {
        keyPair = createKeyPair();
        jwksKeySetJson = createJwksKeySetJson();
    }

    @SneakyThrows(JOSEException.class)
    public String createSignedJwt(List<String> roles) {
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .audience(CONFIGURED_AUDIENCE_VALUE)
                .issuer(CONFIGURED_ISSUER_VALUE)
                .expirationTime(createDateInFuture())
                .issueTime(Date.from(Instant.now()))
                .subject(VALID_SUBJECT_VALUE)
                .claim("name", "Robert White")
                .claim("groups", roles)
                .build();

        JWSHeader jwsHeader = new JWSHeader.Builder(JWSAlgorithm.RS256)
                .keyID(KEY_ID_VALUE)
                .type(JOSEObjectType.JWT)
                .build();

        SignedJWT signedJwt = new SignedJWT(jwsHeader, jwtClaimsSet);

        RSASSASigner signer = new RSASSASigner(keyPair.getPrivate());
        signedJwt.sign(signer);

        return signedJwt.serialize();
    }

    public String getJwksKeySetJson() {
        return jwksKeySetJson;
    }

    @SneakyThrows(JsonProcessingException.class)
    private String createJwksKeySetJson() {
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
        Encoder encoder = Base64.getEncoder();
        JwksKey jwksKey = new JwksKey(
                "RSA",
                "sig",
                KEY_ID_VALUE,
                encoder.encodeToString(publicKey.getModulus().toByteArray()),
                encoder.encodeToString(publicKey.getPublicExponent().toByteArray()),
                CONFIGURED_ISSUER_VALUE);
        JwksKeySet jwksKeySet = new JwksKeySet(Collections.singletonList(jwksKey));

        return new ObjectMapper().writeValueAsString(jwksKeySet);
    }

    @SneakyThrows(NoSuchAlgorithmException.class)
    private KeyPair createKeyPair() {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048);

        return generator.generateKeyPair();
    }

    private Date createDateInFuture() {
        return Date.from(Instant.now().plus(1, ChronoUnit.HOURS));
    }

    private record JwksKeySet(@JsonProperty("keys") List<JwksKey> keys) {
    }

    private record JwksKey(@JsonProperty("kty") String algorithm,
            @JsonProperty("use") String use,
            @JsonProperty("kid") String keyId,
            @JsonProperty("n") String modulus,
            @JsonProperty("e") String exponent,
            @JsonProperty("issuer") String issuer) {
    }
}
