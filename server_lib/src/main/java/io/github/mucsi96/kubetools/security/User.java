package io.github.mucsi96.kubetools.security;

import java.util.List;

import lombok.Data;

@Data
public class User {
    private final String username;
    private final List<String> roles;
    private final String displayName;
    private final String email;
}
