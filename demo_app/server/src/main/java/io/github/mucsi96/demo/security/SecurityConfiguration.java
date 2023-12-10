package io.github.mucsi96.demo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import io.github.mucsi96.kubetools.security.KubetoolsSecurityConfigurer;
import io.github.mucsi96.kubetools.security.MockSecurityConfigurer;

@Configuration
public class SecurityConfiguration {

    @Bean
    @Profile("prod")
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.apply(new KubetoolsSecurityConfigurer());
        return http.build();
    }

    @Bean
    @Profile("!prod")
    SecurityFilterChain mockSecurityFilterChain(HttpSecurity http) throws Exception {
        http.apply(new MockSecurityConfigurer());
        return http.build();
    }
}
