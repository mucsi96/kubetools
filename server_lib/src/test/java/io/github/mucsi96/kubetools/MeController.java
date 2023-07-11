package io.github.mucsi96.kubetools;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedCredentialsNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.mucsi96.kubetools.security.AutheliaUser;
import jakarta.annotation.security.RolesAllowed;

@RestController
@RolesAllowed("user")
public class MeController {

    @GetMapping("/me")
    AutheliaUser getMe(Authentication authentication) {
        if (!(authentication instanceof PreAuthenticatedAuthenticationToken)) {
            throw new PreAuthenticatedCredentialsNotFoundException("");
        }

        return(AutheliaUser) authentication.getDetails();
    }
}

