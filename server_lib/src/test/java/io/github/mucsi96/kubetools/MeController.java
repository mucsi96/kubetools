package io.github.mucsi96.kubetools;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.mucsi96.kubetools.security.AutheliaService;
import io.github.mucsi96.kubetools.security.AutheliaUser;
import jakarta.annotation.security.RolesAllowed;

@RestController
@RolesAllowed("user")
public class MeController {

    @GetMapping("/me")
    AutheliaUser getMe(Authentication authentication, AutheliaService autheliaService) {
        return autheliaService.getUser(authentication);
    }
}

