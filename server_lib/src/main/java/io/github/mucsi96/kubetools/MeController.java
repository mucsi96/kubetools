package io.github.mucsi96.kubetools;

import java.util.Arrays;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedCredentialsNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.mucsi96.kubetools.security.AutheliaUser;
import io.github.mucsi96.kubetools.security.User;
import jakarta.annotation.security.RolesAllowed;

@RestController
@RolesAllowed("user")
public class MeController {

    @GetMapping("/me")
    User getMe(Authentication authentication) {
        if (!(authentication instanceof PreAuthenticatedAuthenticationToken)) {
            throw new PreAuthenticatedCredentialsNotFoundException("");
        }

        AutheliaUser user = (AutheliaUser) authentication.getDetails();

        return new User(
                (String) authentication.getPrincipal(),
                Arrays.asList(user.getGroups().split(",")),
                user.getDisplayName(),
                user.getEmail());
    }
}
