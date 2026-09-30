package com.example.ecommerce.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecommerce.entity.Payment;
import com.example.ecommerce.enums.PaymentMode;
import com.example.ecommerce.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController 
{
	private PaymentService paymentService;
	
	@PostMapping("/{orderid}")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<Payment> pay(@PathVariable Long orderid,@RequestParam PaymentMode paymentMode,Authentication auth)
	{
		Payment payment=paymentService.pay(orderid, paymentMode, auth);
		return ResponseEntity.ok(payment);
	}
	
	//show my payments
	@GetMapping("/my")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<List<Payment>> myPayments(Authentication auth)
	{
		return ResponseEntity.ok(paymentService.getMyPayments(auth));
	}
	
	//all payments
	@GetMapping("/all")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<Payment>> allPayments()
	{
		return ResponseEntity.ok(paymentService.getAllPayments());
	}
	

	public PaymentController(PaymentService paymentService) {
		super();
		this.paymentService = paymentService;
	}
	
	

}
