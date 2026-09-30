package com.example.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecommerce.dto.JwtResponse;
import com.example.ecommerce.dto.LoginRequest;
import com.example.ecommerce.dto.RegisterRequest;
import com.example.ecommerce.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController 
{
	private final AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<String> register(@RequestBody RegisterRequest request)
	{
		return ResponseEntity.ok(authService.register(request));
	}
	
	
	@PostMapping("/login")
	public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest request)
	{
		return ResponseEntity.ok(authService.login(request));
	}
	
	
	public AuthController(AuthService authService) {
		super();
		this.authService = authService;
	}
	
	

}
