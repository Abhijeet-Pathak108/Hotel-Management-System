package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	 @ExceptionHandler(UserAlreadyExistException.class)
	    public ResponseEntity<?> handleUserExists(UserAlreadyExistException ex) {
	        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
	    }
	 
	 @ExceptionHandler(UserNotFoundException.class)
		 public ResponseEntity<?> isUserExist(UserNotFoundException ex){
			 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
		 }
	 

}
