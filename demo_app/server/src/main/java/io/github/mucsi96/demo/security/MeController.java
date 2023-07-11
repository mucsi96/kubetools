package io.github.mucsi96.demo.security;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.mucsi96.kubetools.security.AutheliaUser;
import io.github.mucsi96.kubetools.security.AutheliaUserService;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;

@RestController
@RolesAllowed("user")
@RequiredArgsConstructor
public class MeController {

    AutheliaUserService autheliaUserService;

    @GetMapping("/me")
    AutheliaUser getMe(Authentication authentication) {
        return autheliaUserService.getUser(authentication);
    }
}
