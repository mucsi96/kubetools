package io.github.mucsi96.kubetools.security;

import java.util.Collection;
import java.util.List;

import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public class MockJwtAuthenticationConverter implements Converter<Jwt, JwtAuthenticationToken> {

    @Override
    @Nullable
    public JwtAuthenticationToken convert(Jwt source) {
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .subject("user")
                .claim("name", "Robert White")
                .claim("groups", List.of("user"))
                .build();
        Collection<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("ROLE_user");
        return new JwtAuthenticationToken(jwt, authorities);
    }

}
