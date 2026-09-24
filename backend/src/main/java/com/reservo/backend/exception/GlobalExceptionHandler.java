package com.reservo.backend.exception;

import com.reservo.backend.dto.ApiResponse;
import com.reservo.backend.dto.ValidationErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ApiResponse<Void>> handleBaseException(BaseException ex) {
        log.warn("Business exception occurred: {} (Status: {})", ex.getMessage(), ex.getStatus());
        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, ex.getStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<List<ValidationErrorResponse>>> handleValidationException(MethodArgumentNotValidException ex) {
        log.warn("Validation failed for request: {}", ex.getBindingResult().getObjectName());
        
        List<ValidationErrorResponse> validationErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> ValidationErrorResponse.builder()
                        .field(fieldError.getField())
                        .rejectedValue(fieldError.getRejectedValue())
                        .message(fieldError.getDefaultMessage())
                        .build())
                .collect(Collectors.toList());

        ApiResponse<List<ValidationErrorResponse>> response = ApiResponse.error("Validation failed", validationErrors);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        log.warn("HTTP method not supported: {}", ex.getMethod());
        ApiResponse<Void> response = ApiResponse.error("HTTP method '" + ex.getMethod() + "' is not supported for this endpoint");
        return new ResponseEntity<>(response, HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        log.warn("Access denied error: {}", ex.getMessage());
        ApiResponse<Void> response = ApiResponse.error("You do not have permission to access this resource");
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.warn("Invalid argument: {}", ex.getMessage());
        ApiResponse<Void> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(org.springframework.web.servlet.resource.NoResourceFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNoResourceFound(org.springframework.web.servlet.resource.NoResourceFoundException ex) {
        log.warn("Resource route not found: {}", ex.getResourcePath());
        ApiResponse<Void> response = ApiResponse.error("The requested endpoint or resource was not found.");
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(org.springframework.web.multipart.MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse<Void>> handleMaxUploadSize(org.springframework.web.multipart.MaxUploadSizeExceededException ex) {
        log.warn("Uploaded payload exceeded maximum allowable size limit: {}", ex.getMessage());
        ApiResponse<Void> response = ApiResponse.error("Uploaded file exceeds the maximum allowed upload limit (25MB per file, 30MB per request).");
        return new ResponseEntity<>(response, HttpStatus.PAYLOAD_TOO_LARGE);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {
        log.error("An unexpected error occurred in the system: ", ex);
        ApiResponse<Void> response = ApiResponse.error("An unexpected error occurred. Please contact administrator.");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
