package io.github.mucsi96.kubetools.security;

import lombok.Data;

@Data
public class AutheliaUser {
  private final String username;
  private final String groups;
  private final String displayName;
  private final String email;
}
