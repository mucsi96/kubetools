package com.example.demo.core;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedCredentialsNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class AppControllerAdvice {

  @ExceptionHandler(PreAuthenticatedCredentialsNotFoundException.class)
  public ResponseEntity handlePreAuthenticatedCredentialsNotFoundException() {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(null);
  }
}
