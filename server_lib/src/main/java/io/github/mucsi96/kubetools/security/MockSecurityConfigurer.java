package io.github.mucsi96.kubetools.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationConverter;
import org.springframework.security.web.authentication.AuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class MockSecurityConfigurer extends AbstractHttpConfigurer<MockSecurityConfigurer, HttpSecurity> {

    @Override
    public void init(HttpSecurity http) throws Exception {
        http
                .sessionManagement(configurer -> configurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .anonymous(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .headers(configurer -> configurer.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .exceptionHandling(c -> c.accessDeniedHandler(new RestAccessDeniedHandler()))
                .addFilterAt(new MockAuthenticationFilter(), BasicAuthenticationFilter.class);
    }

    class MockAuthenticationFilter extends AuthenticationFilter {
        public MockAuthenticationFilter() {
            super((AuthenticationManager) authentication -> {
                return authentication;
            }, (AuthenticationConverter) request -> {
                Jwt jwt = Jwt.withTokenValue("token")
                        .header("alg", "none")
                        .subject("user")
                        .claim("name", "Robert White")
                        .claim("groups", List.of("user"))
                        .build();
                Collection<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("ROLE_user");
                return new JwtAuthenticationToken(jwt, authorities);
            });

            this.setSuccessHandler((HttpServletRequest request, HttpServletResponse response,
                    Authentication authentication) -> {
            });
        }
    }
}
