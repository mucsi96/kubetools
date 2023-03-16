package com.example.demo.security;

import java.util.List;

import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
@Profile({ "local" })
public class MockAuthenticationManager implements AuthenticationManager {

  @Override
  public Authentication authenticate(Authentication authentication) throws AuthenticationException {
    AutheliaUser autheliaUser = new AutheliaUser("rob", "user", "Rober White", "robert.white@mockemail.com");

    return new PreAuthenticatedAuthenticationToken(
        autheliaUser, "N/A",
        List.of(() -> "ROLE_user"));
  }

}
