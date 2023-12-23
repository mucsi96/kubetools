package io.github.mucsi96.kubetools.security;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

public class KubetoolsSecurityConfigurer extends AbstractHttpConfigurer<KubetoolsSecurityConfigurer, HttpSecurity> {}
