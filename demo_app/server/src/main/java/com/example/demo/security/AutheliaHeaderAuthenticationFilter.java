package com.example.demo.security;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AutheliaHeaderAuthenticationFilter extends AbstractPreAuthenticatedProcessingFilter {

  public AutheliaHeaderAuthenticationFilter(AuthenticationManager authenticationManager) {
    this.setAuthenticationManager(authenticationManager);
    this.setContinueFilterChainOnUnsuccessfulAuthentication(false);
  }

  @Override
  protected Object getPreAuthenticatedPrincipal(HttpServletRequest request) {
    String username = request.getHeader("Remote-User");
    String groups = request.getHeader("Remote-Groups");
    String displayName = request.getHeader("Remote-Name");
    String email = request.getHeader("Remote-Email");

    log.debug("Authenticating using AutheliaHeaderAuthenticationFilter");
    log.debug("username: {}, groups: {}, displayName: {}, email: {}", username, groups, displayName, email);

    if (username == null || groups == null || displayName == null || email == null) {
      log.debug("Insuficient header data for authentication.");
      return "N/A";
    }

    log.debug("Creating AutheliaUser...");

    return new AutheliaUser(username, groups, displayName, email);
  }

  @Override
  protected Object getPreAuthenticatedCredentials(HttpServletRequest request) {
    return "N/A";
  }
}
