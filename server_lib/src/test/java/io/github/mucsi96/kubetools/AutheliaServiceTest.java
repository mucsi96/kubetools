package io.github.mucsi96.kubetools;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletResponse;

import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;

public class AutheliaServiceTest extends BaseIntegrationTest {
        
    @Test
    public void returns_logged_in_user_details() throws Exception {
        MockHttpServletResponse response = mockMvc.perform(
                get("/me")
                        .headers(getAuthHeaders("user")))
                .andReturn()
                .getResponse();

        assertThat(response.getStatus()).isEqualTo(200);
        DocumentContext body = JsonPath.parse(response.getContentAsString());
        assertThat(body.read("$.username", String.class)).isEqualTo("rob");
        assertThat(body.read("$.roles[0]", String.class)).isEqualTo("user");
        assertThat(body.read("$.displayName", String.class)).isEqualTo("Robert White");
        assertThat(body.read("$.email", String.class)).isEqualTo("robert.white@mockemail.com");

    }

    @Test
    public void returns_forbidden_if_user_has_no_user_authority() throws Exception {
        MockHttpServletResponse response = mockMvc.perform(
                get("/me")
                        .headers(getAuthHeaders("guest")))
                .andReturn()
                .getResponse();

        assertThat(response.getStatus()).isEqualTo(403);
        DocumentContext body = JsonPath.parse(response.getContentAsString());
        assertThat(body.read("$.status", Integer.class)).isEqualTo(403);
    }

    @Test
    public void returns_unauthorized_if_auth_headers_are_missing() throws Exception {
        MockHttpServletResponse response = mockMvc.perform(
                get("/me"))
                .andReturn()
                .getResponse();

        assertThat(response.getStatus()).isEqualTo(401);
        DocumentContext body = JsonPath.parse(response.getContentAsString());
        assertThat(body.read("$.status", Integer.class)).isEqualTo(401);
    }
}
