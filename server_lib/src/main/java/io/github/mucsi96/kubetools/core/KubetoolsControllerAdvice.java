package io.github.mucsi96.kubetools.core;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedCredentialsNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class KubetoolsControllerAdvice {

  @ExceptionHandler(PreAuthenticatedCredentialsNotFoundException.class)
  public ResponseEntity<ErrorResponse> handlePreAuthenticatedCredentialsNotFoundException() {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(new ErrorResponse(HttpStatus.UNAUTHORIZED));
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorResponse> handleAccessDeniedException() {
    return ResponseEntity.status(HttpStatus.FORBIDDEN)
        .body(new ErrorResponse(HttpStatus.FORBIDDEN));
  }
}
