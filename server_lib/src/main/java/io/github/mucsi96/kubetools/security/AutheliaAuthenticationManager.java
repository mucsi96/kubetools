package io.github.mucsi96.kubetools.security;

import java.util.List;

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

      List<GrantedAuthority> authorities = autheliaUser.getRoles().stream().map(group -> {
        return (GrantedAuthority) () -> "ROLE_" + group;
      }).toList();

      PreAuthenticatedAuthenticationToken token = new PreAuthenticatedAuthenticationToken(
          autheliaUser.getUsername(), "N/A", authorities);
      token.setDetails(autheliaUser);
      return token;
    }

    throw new PreAuthenticatedCredentialsNotFoundException(
        "Authelia headers not found in request.");
  }

}
