package io.github.mucsi96.demo.security;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.mucsi96.kubetools.security.AutheliaService;
import io.github.mucsi96.kubetools.security.AutheliaUser;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;

@RestController
@RolesAllowed("user")
@RequiredArgsConstructor
public class MeController {

    @GetMapping("/me")
    AutheliaUser getMe(@Parameter(hidden = true) AutheliaService autheliaService) {
        return autheliaService.getUser();
    }
}
