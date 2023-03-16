package com.example.demo.configuration;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import com.example.demo.core.FilterChainExceptionHandlerFilter;
import com.example.demo.security.AutheliaHeaderAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(jsr250Enabled = true)
public class SecurityConfiguration {

  @Bean
  SecurityFilterChain actuatorSecurityFilterChain(HttpSecurity http) throws Exception {
    http.securityMatcher(EndpointRequest.toAnyEndpoint());
    http.authorizeHttpRequests((requests) -> requests.anyRequest().permitAll());
    http.csrf().disable();

    return http.build();
  }

  @Bean
  SecurityFilterChain defaultSecurityFilterChain(
      HttpSecurity http,
      @Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver,
      AuthenticationManager authenticationManager)
      throws Exception {

    http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

    http.anonymous().disable();
    http.csrf().disable();
    http.headers().frameOptions().disable();
    http.formLogin().disable();
    http.logout().disable();

    http.addFilter(new AutheliaHeaderAuthenticationFilter(authenticationManager));
    http.addFilterBefore(new FilterChainExceptionHandlerFilter(resolver),
        AbstractPreAuthenticatedProcessingFilter.class);

    return http.build();
  }
}
