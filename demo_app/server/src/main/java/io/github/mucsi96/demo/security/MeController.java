package io.github.mucsi96.demo.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.mucsi96.kubetools.security.AutheliaService;
import io.github.mucsi96.kubetools.security.AutheliaUser;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;

@RestController
@RolesAllowed("user")
@RequiredArgsConstructor
public class MeController {

    @GetMapping("/me")
    AutheliaUser getMe(AutheliaService autheliaService) {
        SecurityContext context = SecurityContextHolder.getContext();
        return autheliaService.getUser(context.getAuthentication());
    }
}
