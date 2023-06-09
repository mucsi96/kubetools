package io.github.mucsi96.demo.message;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.mucsi96.kubetools.security.AutheliaService;
import io.github.mucsi96.kubetools.security.AutheliaUser;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RolesAllowed("user")
public class MessageController {
    private final MessageRepository messageRepository;

    @GetMapping(value = "/message", produces = MediaType.APPLICATION_JSON_VALUE)
    public MessageResponse getMessage(@Parameter(hidden = true) AutheliaService autheliaService) {
        AutheliaUser user = autheliaService.getUser();
        
        return new MessageResponse("Hi " + user.getDisplayName() + "! " + messageRepository.findAll().get(0).getContent());
    }
}
