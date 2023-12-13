package io.github.mucsi96.kubetools;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import io.github.mucsi96.kubetools.security.KubetoolsSecurityConfigurer;
import io.github.mucsi96.kubetools.security.MockSecurityConfigurer;

@SpringBootApplication
public class TestApplication {
	@Bean
	@Profile("prod")
	SecurityFilterChain securityFilterChain(HttpSecurity http, KubetoolsSecurityConfigurer kubetoolsSecurityConfigurer)
			throws Exception {
		http.with(kubetoolsSecurityConfigurer, Customizer.withDefaults());
		return http.build();
	}

	@Bean
	@Profile("!prod")
	SecurityFilterChain mockSecurityFilterChain(HttpSecurity http, MockSecurityConfigurer mockSecurityConfigurer)
			throws Exception {
		return http.with(mockSecurityConfigurer, Customizer.withDefaults()).build();
	}

	public static void main(String[] args) {
		SpringApplication.run(TestApplication.class, args);
	}

}
