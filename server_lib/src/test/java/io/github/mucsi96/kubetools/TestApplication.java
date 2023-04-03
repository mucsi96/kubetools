package io.github.mucsi96.kubetools;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import io.github.mucsi96.kubetools.security.KubetoolsSecurityConfigurer;

@SpringBootApplication
public class TestApplication {

	@Bean
	SecurityFilterChain securityFilterChain(
			HttpSecurity http,
			KubetoolsSecurityConfigurer kubetoolsSecurityConfigurer) throws Exception {
		return kubetoolsSecurityConfigurer.configure(http).build();
	}

	public static void main(String[] args) {
		SpringApplication.run(TestApplication.class, args);
	}

}
