package com.example.demo.security;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedCredentialsNotFoundException;
import org.springframework.stereotype.Component;

@Component
@Profile({ "prod", "test" })
public class AutheliaAuthenticationManager implements AuthenticationManager {

  @Override
  public Authentication authenticate(Authentication authentication) throws AuthenticationException {
    Object principal = authentication.getPrincipal();
    if (principal instanceof AutheliaUser) {
      AutheliaUser autheliaUser = (AutheliaUser) principal;
      List<GrantedAuthority> authorities = Stream.of(autheliaUser.getGroups().split(",")).map(group -> {
        return (GrantedAuthority) () -> "ROLE_" + group;
      }).collect(Collectors.toList());
      return new PreAuthenticatedAuthenticationToken(principal, "N/A", authorities);
    }

    throw new PreAuthenticatedCredentialsNotFoundException(
        "Authelia headers not found in request.");
  }

}
