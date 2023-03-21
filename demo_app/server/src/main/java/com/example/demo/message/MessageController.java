package com.example.demo.message;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RolesAllowed("user")
public class MessageController {
    private final MessageRepository messageRepository;

    @GetMapping(value = "/message", produces = MediaType.APPLICATION_JSON_VALUE)
    public MessageResponse getMessage() {
        return new MessageResponse(messageRepository.findAll().get(0).getContent());
    }
}
