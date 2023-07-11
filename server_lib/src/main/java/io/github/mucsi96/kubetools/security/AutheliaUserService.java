package io.github.mucsi96.kubetools.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedCredentialsNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AutheliaUserService {
    public AutheliaUser getUser(Authentication authentication) {
        if (!(authentication instanceof PreAuthenticatedAuthenticationToken)) {
            throw new PreAuthenticatedCredentialsNotFoundException("");
        }

        return (AutheliaUser) authentication.getDetails();
    }
}
