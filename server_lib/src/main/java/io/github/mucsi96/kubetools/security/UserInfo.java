package io.github.mucsi96.kubetools.security;

import java.util.List;

public record UserInfo(String preferred_username, String name, String email, List<String> groups) {}
