package com.example.demo.security;

import java.util.Arrays;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedCredentialsNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.security.RolesAllowed;

@RestController
@RolesAllowed("user")
public class MeController {
    @GetMapping("/me")
    User getMe(Authentication authentication) {
        if (!(authentication instanceof PreAuthenticatedAuthenticationToken)) {
            throw new PreAuthenticatedCredentialsNotFoundException("");
        }

        AutheliaUser user = (AutheliaUser) authentication.getPrincipal();

        return new User(
                user.getUsername(),
                Arrays.asList(user.getGroups().split(",")),
                user.getDisplayName(),
                user.getEmail());
    }
}
