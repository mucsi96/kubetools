package io.github.mucsi96.kubetools.security;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

public interface KubetoolsSecurityConfigurer {
    HttpSecurity configure(HttpSecurity http) throws Exception;
}
