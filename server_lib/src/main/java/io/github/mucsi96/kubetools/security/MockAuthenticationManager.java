package io.github.mucsi96.kubetools.security;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
@Profile({ "local" })
public class MockAuthenticationManager implements AuthenticationManager {

  @Override
  public Authentication authenticate(Authentication authentication) throws AuthenticationException {
    AutheliaUser autheliaUser = new AutheliaUser("rob", "user", "Robert White", "robert.white@mockemail.com");

    List<GrantedAuthority> authorities = Stream.of(autheliaUser.getGroups().split(",")).map(group -> {
      return (GrantedAuthority) () -> "ROLE_" + group;
    }).collect(Collectors.toList());

    PreAuthenticatedAuthenticationToken token = new PreAuthenticatedAuthenticationToken(
        autheliaUser.getUsername(),
        "N/A",
        authorities);

    token.setDetails(autheliaUser);

    return token;
  }
}
