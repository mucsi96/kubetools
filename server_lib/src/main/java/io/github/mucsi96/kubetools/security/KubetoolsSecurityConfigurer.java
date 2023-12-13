package io.github.mucsi96.kubetools.security;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class KubetoolsSecurityConfigurer extends AbstractHttpConfigurer<KubetoolsSecurityConfigurer, HttpSecurity> {
    private final UserInfoOpaqueTokenIntrospector infoOpaqueTokenIntrospector;

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
                .oauth2ResourceServer(oauth2 -> oauth2
                        .bearerTokenResolver(bearerTokenResolver())
                        .authenticationEntryPoint(new RestAuthenticationEntryPoint())
                        .accessDeniedHandler(new RestAccessDeniedHandler())
                        .opaqueToken(configurer -> configurer.introspector(infoOpaqueTokenIntrospector)));
    }

    BearerTokenResolver bearerTokenResolver() {
        return request -> {
            Cookie cookie = WebUtils.getCookie(request, "accessToken");
            return cookie != null ? cookie.getValue() : null;
        };
    }
}
