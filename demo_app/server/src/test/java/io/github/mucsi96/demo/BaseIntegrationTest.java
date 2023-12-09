package io.github.mucsi96.demo;

import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;

import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.junit5.WireMockExtension;
import com.nimbusds.jose.Algorithm;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.jwk.KeyUse;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.gen.RSAKeyGenerator;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import jakarta.servlet.http.Cookie;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
public class BaseIntegrationTest {

    @Autowired
    MockMvc mockMvc;
    private RSAKey rsaKey;

    @RegisterExtension
    static WireMockExtension mockAuthServer = WireMockExtension.newInstance()
            .options(wireMockConfig().dynamicPort())
            .build();

    @DynamicPropertySource
    static void overrideProperties(DynamicPropertyRegistry registry) {

        registry.add("spring.security.oauth2.resourceserver.jwt.jwk-set-uri",
                () -> mockAuthServer.baseUrl());
    }

    @BeforeEach
    public void beforeEach() throws Exception {
        // generate an RSA Key Pair
        rsaKey = new RSAKeyGenerator(2048)
                .keyUse(KeyUse.SIGNATURE)
                .algorithm(new Algorithm("RS256"))
                .keyID("random key")
                .generate();

        var rsaPublicJWK = rsaKey.toPublicJWK();
        var jwkResponse = String.format("{\"keys\": [%s]}", rsaPublicJWK.toJSONString());

        // return mock JWK response
        mockAuthServer.stubFor(WireMock.get("/")
                .willReturn(WireMock.aResponse()
                        .withHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                        .withBody(jwkResponse)));
    }

    Cookie getAccessTokenCookie() throws Exception {
        var signer = new RSASSASigner(rsaKey);
        var claimsSet = new JWTClaimsSet.Builder()
                .expirationTime(new Date(new Date().getTime() + 60 * 1000))
                .build();
        var signedJWT = new SignedJWT(new JWSHeader.Builder(JWSAlgorithm.RS256)
                .keyID(rsaKey.getKeyID()).build(), claimsSet);
        signedJWT.sign(signer);
        return new Cookie("accessToken", signedJWT.serialize());
    }

}
