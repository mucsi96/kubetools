package io.github.mucsi96.demo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.util.WebUtils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(jsr250Enabled = true)
public class SecurityConfiguration {

    String bearerTokenResolver(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, "accessToken");
        return cookie != null ? cookie.getValue() : null;
    }

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {
        return http
                .oauth2ResourceServer(oauth2 -> oauth2
                        .bearerTokenResolver(this::bearerTokenResolver)
                        .jwt())
                .build();
    }
}
