package com.example.ecommerce.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecommerce.entity.Order;
import com.example.ecommerce.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@PreAuthorize("hasRole('USER')")
public class OrderController 
{
	private OrderService orderService;

	//place order
	@PostMapping("/placeorder")
	public ResponseEntity<Order> placeOrder(Authentication auth)
	{
		return ResponseEntity.ok(orderService.placeOrder(auth));
	}
	
	//view single order
	@GetMapping("/{orderid}")
	public ResponseEntity<Order> getOrder(@PathVariable Long orderid,Authentication auth)
	{
		return ResponseEntity.ok(orderService.getOrderById(orderid, auth));
	}
	
	//view all orders
	@GetMapping
	public ResponseEntity<List<Order>> getMyOrders(Authentication auth)
	{
		return ResponseEntity.ok(orderService.getMyOrders(auth));	
	}
	
	//cancel order
	@PutMapping("/cancel/{orderid}")
	public ResponseEntity<Order> cancelorder(@PathVariable Long orderid,Authentication auth)
	{
		return ResponseEntity.ok(orderService.cancelOrder(orderid,auth));
	}
	
	public OrderController(OrderService orderService) {
		super();
		this.orderService = orderService;
	}
	
	

}
