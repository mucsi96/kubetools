package com.example.demo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletResponse;

import com.example.demo.message.Message;
import com.example.demo.message.MessageRepository;
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
        assertThat(JsonPath.parse(response.getContentAsString()).read("$.message", String.class)).isEqualTo("test message");

    }

    @Test
    public void returns_forbidden_if_user_has_no_user_authority() throws Exception {
        MockHttpServletResponse response = mockMvc.perform(
                get("/message")
                        .headers(getAuthHeaders("guest")))
                .andReturn()
                .getResponse();

        assertThat(response.getStatus()).isEqualTo(403);
        assertThat(JsonPath.parse(response.getContentAsString()).read("$.status", Integer.class)).isEqualTo(403);
    }

    @Test
    public void returns_unauthorized_if_auth_headers_are_missing() throws Exception {
        MockHttpServletResponse response = mockMvc.perform(
                get("/message"))
                .andReturn()
                .getResponse();

        assertThat(response.getStatus()).isEqualTo(401);
        assertThat(JsonPath.parse(response.getContentAsString()).read("$.status", Integer.class)).isEqualTo(401);
    }
}
