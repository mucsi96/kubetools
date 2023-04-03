package io.github.mucsi96.kubetools.security;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import io.github.mucsi96.kubetools.core.FilterChainExceptionHandlerFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(jsr250Enabled = true)
public class KubetoolsSecurityConfiguration {

  @Bean
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
      AuthenticationManager authenticationManager) {

    return (HttpSecurity http) -> {
      return http
          .sessionManagement(configurer -> configurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
          .anonymous(AbstractHttpConfigurer::disable)
          .csrf(AbstractHttpConfigurer::disable)
          .headers(configurer -> configurer.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
          .formLogin(AbstractHttpConfigurer::disable)
          .logout(AbstractHttpConfigurer::disable)
          .addFilter(new AutheliaHeaderAuthenticationFilter(authenticationManager))
          .addFilterBefore(new FilterChainExceptionHandlerFilter(resolver),
              AbstractPreAuthenticatedProcessingFilter.class);
    };
  }
}
