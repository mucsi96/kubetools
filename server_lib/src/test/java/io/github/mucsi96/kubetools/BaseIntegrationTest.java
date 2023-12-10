package io.github.mucsi96.kubetools;

import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.junit5.WireMockExtension;

import jakarta.servlet.http.Cookie;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class BaseIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    JWSGenerator jwsGenerator;

    @RegisterExtension
    static WireMockExtension mockAuthServer = WireMockExtension.newInstance()
            .options(wireMockConfig().dynamicPort())
            .build();

    @DynamicPropertySource
    static void overrideProperties(DynamicPropertyRegistry registry) {

        registry.add("spring.security.oauth2.resourceserver.jwt.jwk-set-uri",
                () -> mockAuthServer.baseUrl() + "/jwks.json");
    }

    @BeforeEach
    public void beforeEach() throws Exception {
        // return mock JWK response
        mockAuthServer.stubFor(WireMock.get("/jwks.json")
                .willReturn(WireMock.aResponse()
                        .withHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                        .withBody(jwsGenerator.getJwksKeySetJson())));
    }

    Cookie getAccessTokenCookie(List<String> roles) throws Exception {
        return new Cookie("accessToken", jwsGenerator.createSignedJwt(roles));
    }
}
