package com.example.ecommerce.controller;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecommerce.entity.User;
import com.example.ecommerce.enums.Role;
import com.example.ecommerce.enums.SellerStatus;
import com.example.ecommerce.repository.UserRepository;


@RestController
@RequestMapping("/api/seller")
public class SellerRequestController 
{
	
	private final UserRepository userRepository;
	
	@PostMapping("/request")
	public String requestSeller(Authentication auth)
	{
		String email=auth.getName();
		User user=userRepository.findByEmail(email).orElseGet(null);
		user.setSellerStatus(SellerStatus.REQUESTED);
		userRepository.save(user);
		
		return "Seller request sent to admin";
	}

	@GetMapping("/requests")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<User>> getAllSellerRequests() {
		List<User> requests = userRepository.findBySellerStatus(SellerStatus.REQUESTED);
		return ResponseEntity.ok(requests);
	}

	@PostMapping("/approve/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<String> approveSeller(@PathVariable Long id) {
		User user = userRepository.findById(id)
			.orElseThrow(() -> new RuntimeException("User not found"));
		
		if (user.getSellerStatus() == SellerStatus.APPROVED) {
			return ResponseEntity.badRequest().body("Seller already approved");
		}
		
		user.setRole(Role.SELLER);
		user.setSellerStatus(SellerStatus.APPROVED);
		userRepository.save(user);
		
		return ResponseEntity.ok("Seller approved successfully");
	}

	@PostMapping("/reject/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<String> rejectSeller(@PathVariable Long id) {
		User user = userRepository.findById(id)
			.orElseThrow(() -> new RuntimeException("User not found"));
		
		if (user.getSellerStatus() == SellerStatus.REJECTED) {
			return ResponseEntity.badRequest().body("Seller already rejected");
		}
		
		user.setSellerStatus(SellerStatus.REJECTED);
		userRepository.save(user);
		
		return ResponseEntity.ok("Seller rejected successfully");
	}

	public SellerRequestController(UserRepository userRepository) {
		super();
		this.userRepository = userRepository;
	}
	
	

}
