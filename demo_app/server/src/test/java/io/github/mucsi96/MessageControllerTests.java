package io.github.mucsi96;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletResponse;

import io.github.mucsi96.message.Message;
import io.github.mucsi96.message.MessageRepository;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;

public class MessageControllerTests extends BaseIntegrationTest {
    @Autowired
    MessageRepository messageRepository;

    @BeforeEach
    void setup() {
        Message message = new Message("test message");
        messageRepository.save(message);
    }

    @AfterEach
    void cleanup() {
        messageRepository.deleteAll();
    }

    @Test
    public void returns_the_message() throws Exception {
        MockHttpServletResponse response = mockMvc.perform(
                get("/message")
                        .headers(getAuthHeaders("user")))
                .andReturn()
                .getResponse();

        assertThat(response.getStatus()).isEqualTo(200);
        DocumentContext body = JsonPath.parse(response.getContentAsString());
        assertThat(body.read("$.message", String.class)).isEqualTo("test message");

    }
}
