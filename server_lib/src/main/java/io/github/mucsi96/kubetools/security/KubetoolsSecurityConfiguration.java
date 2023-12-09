package io.github.mucsi96.kubetools.security;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.util.WebUtils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(jsr250Enabled = true)
public class KubetoolsSecurityConfiguration {

  @Bean
  @Profile({ "prod", "test" })
  @Order(Ordered.HIGHEST_PRECEDENCE)
  SecurityFilterChain actuatorSecurityFilterChain(HttpSecurity http) throws Exception {
    return http
        .securityMatcher(EndpointRequest.toAnyEndpoint())
        .authorizeHttpRequests((requests) -> requests.anyRequest().permitAll())
        .csrf(AbstractHttpConfigurer::disable)
        .build();
  }

  @Bean
  KubetoolsSecurityConfigurer kubetoolsSecurityConfigurer(
      @Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver,
      Converter<Jwt, AbstractAuthenticationToken> jwtAuthenticationConverter) {

    return (HttpSecurity http) -> {
      return http
          .sessionManagement(configurer -> configurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
          .anonymous(AbstractHttpConfigurer::disable)
          .csrf(AbstractHttpConfigurer::disable)
          .headers(configurer -> configurer.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
          .formLogin(AbstractHttpConfigurer::disable)
          .logout(AbstractHttpConfigurer::disable)
          .oauth2ResourceServer(oauth2 -> oauth2
              .bearerTokenResolver(this::bearerTokenResolver)
              .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter)));
    };
  }

  String bearerTokenResolver(HttpServletRequest request) {
    Cookie cookie = WebUtils.getCookie(request, "accessToken");
    return cookie != null ? cookie.getValue() : null;
  }

  @Bean
  @Profile({ "prod", "test" })
  JwtAuthenticationConverter jwtAuthenticationConverter() {
    JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
    grantedAuthoritiesConverter.setAuthoritiesClaimName("groups");
    grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

    JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
    jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
    return jwtAuthenticationConverter;
  }

  @Bean
  @Profile({ "local" })
  Converter<Jwt, AbstractAuthenticationToken> mockJwtAuthenticationConverter() {
    return _jwt -> {
      Jwt jwt = Jwt.withTokenValue("token")
          .header("alg", "none")
          .claim("sub", "user")
          .build();
      Collection<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("ROLE_user");
      return new JwtAuthenticationToken(jwt, authorities);
    };
  }

}
