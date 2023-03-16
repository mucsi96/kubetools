package com.example.demo.dataseed;

import com.example.demo.configuration.MessageConfiguration;
import com.example.demo.model.Message;
import com.example.demo.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MessageDataLoader implements CommandLineRunner {
    private final MessageConfiguration messageConfiguration;
    private final MessageRepository messageRepository;

    @Override
    public void run(String... args) throws Exception {
        if (messageRepository.count() == 0) {
            Message message = new Message(messageConfiguration.getMessage());
            messageRepository.save(message);
        }
    }
}
