package io.github.mucsi96.demo.message;

import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.mucsi96.kubetools.security.AutheliaUser;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RolesAllowed("user")
public class MessageController {
    private final MessageRepository messageRepository;

    @GetMapping(value = "/message", produces = MediaType.APPLICATION_JSON_VALUE)
    public MessageResponse getMessage(Authentication authentication) {
        AutheliaUser user = (AutheliaUser) authentication.getPrincipal();
        
        return new MessageResponse("Hi " + user.getDisplayName() + "! " + messageRepository.findAll().get(0).getContent());
    }
}
