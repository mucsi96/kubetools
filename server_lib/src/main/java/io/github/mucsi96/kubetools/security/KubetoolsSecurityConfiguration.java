package io.github.mucsi96.kubetools.security;

import java.util.Collection;
import java.util.List;

import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(jsr250Enabled = true)
public class KubetoolsSecurityConfiguration {

  @Bean
  @Order(Ordered.HIGHEST_PRECEDENCE)
  SecurityFilterChain actuatorSecurityFilterChain(HttpSecurity http) throws Exception {
    return http
        .securityMatcher(EndpointRequest.toAnyEndpoint())
        .authorizeHttpRequests((requests) -> requests.anyRequest().permitAll())
        .csrf(AbstractHttpConfigurer::disable)
        .build();
  }

  @Bean
  @Profile("!prod")
  AuthenticationManager mockAuthenticationManager() {
    return a -> {
      Jwt jwt = Jwt.withTokenValue("token")
          .header("alg", "none")
          .subject("user")
          .claim("name", "Robert White")
          .claim("groups", List.of("user"))
          .build();
      Collection<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("ROLE_user");
      return new JwtAuthenticationToken(jwt, authorities);
    };
  }
}
