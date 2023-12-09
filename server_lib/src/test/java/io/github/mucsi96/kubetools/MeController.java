package io.github.mucsi96.kubetools;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.security.RolesAllowed;

@RestController
@RolesAllowed("user")
public class MeController {

    @GetMapping("/me")
    String getMe(@AuthenticationPrincipal Jwt principal) {
        return principal.getClaimAsString("name");
    }
}
