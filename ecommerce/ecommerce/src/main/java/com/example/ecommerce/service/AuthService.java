package com.example.ecommerce.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.ecommerce.config.JwtUtil;
import com.example.ecommerce.dto.JwtResponse;
import com.example.ecommerce.dto.LoginRequest;
import com.example.ecommerce.dto.RegisterRequest;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.enums.Role;
import com.example.ecommerce.enums.SellerStatus;
import com.example.ecommerce.repository.UserRepository;

@Service
public class AuthService 
{
	private final UserRepository  userRepository;
	private final PasswordEncoder encoder;
	private final JwtUtil jwtUtil;
	
	public String register(RegisterRequest request)
	{
		if(userRepository.findByEmail(request.getEmail()).isPresent())
		{
			throw new RuntimeException("Email already registered");
		}
		
		User user=new User();
		user.setEmail(request.getEmail());
		user.setPassword(encoder.encode(request.getPassword()));
		user.setRole(Role.USER);
		user.setSellerStatus(SellerStatus.NONE);
		
		userRepository.save(user);
		return "Registration Successfully";		
	}

	public JwtResponse login(LoginRequest request)
	{
		User user=userRepository.findByEmail(request.getEmail()).orElseThrow(()->new RuntimeException("Invalid Credential"));
		if(!encoder.matches(request.getPassword(),user.getPassword())) {
			throw new RuntimeException("Invalid Credential");
		}
		
		String token=jwtUtil.generateToken(user.getEmail(),user.getRole());
		return new JwtResponse(token,user.getRole());
	}
	
	public AuthService(UserRepository userRepository, PasswordEncoder encoder, JwtUtil jwtUtil) {
		super();
		this.userRepository = userRepository;
		this.encoder = encoder;
		this.jwtUtil = jwtUtil;
	}
}
