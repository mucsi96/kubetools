package com.example.demo.controller;

import com.example.demo.repository.MessageRepository;

import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RolesAllowed("user")
public class MessageController {
    private final MessageRepository messageRepository;

    @GetMapping(value = "/message", produces = MediaType.APPLICATION_JSON_VALUE)
    public String getMessage() {
        return "\"" + messageRepository.findAll().get(0).getContent() + "\"";
    }
}
