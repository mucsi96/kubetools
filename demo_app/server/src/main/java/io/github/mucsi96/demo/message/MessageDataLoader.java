package io.github.mucsi96.demo.message;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Profile({ "local", "prod" })
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
