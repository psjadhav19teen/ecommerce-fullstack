package com.example.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecommerce.dto.CartItemResponse;
import com.example.ecommerce.dto.CartResponse;
import com.example.ecommerce.entity.Cart;
import com.example.ecommerce.entity.CartItem;
import com.example.ecommerce.service.CartService;

@RestController
@RequestMapping("/api/cart")
@PreAuthorize("hasRole('USER')")
public class CartController 
{

	private final CartService cartService;
	
	//add to cart
	@PostMapping("/add/{productid}")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<?> addtocart(@PathVariable Long productid,Authentication auth)
	{
		cartService.addToCart(productid, auth);
		return ResponseEntity.ok("Product added to cart");
	}
	
	//delete cart
	@DeleteMapping("/remove/{productid}")
	public ResponseEntity<CartResponse> remove(@PathVariable Long productid,Authentication auth)
	{
		return ResponseEntity.ok(toResponse(cartService.removeItem(productid, auth)));
	}
	
	//increaseQty
	@PutMapping("/increase/{productid}")
	public ResponseEntity<CartResponse> increase(@PathVariable Long productid,Authentication auth)
	{
		return ResponseEntity.ok(toResponse(cartService.increaseQty(productid, auth)));
	}
	
	//decrease
	@PutMapping("/decrease/{productid}")
	public ResponseEntity<CartResponse> decrese(@PathVariable Long productid,Authentication auth)
	{
		return ResponseEntity.ok(toResponse(cartService.decreaseQty(productid, auth)));
	}
	
	//show carts
	@GetMapping
	public ResponseEntity<CartResponse> view(Authentication auth)
	{
		return ResponseEntity.ok(toResponse(cartService.getCart(auth)));
	}
	

	public CartController(CartService cartService) {
		super();
		this.cartService = cartService;
	}

	private CartResponse toResponse(Cart cart) {
		CartResponse response = new CartResponse();
		response.setId(cart.getId());
		response.setItems(
				cart.getItems().stream()
						.map(this::toItemResponse)
						.toList()
		);
		return response;
	}

	private CartItemResponse toItemResponse(CartItem item) {
		CartItemResponse response = new CartItemResponse();
		response.setId(item.getId());
		response.setProductId(item.getProduct().getId());
		response.setProductName(item.getProduct().getName());
		response.setProductDescription(item.getProduct().getDescription());
		response.setProductImage(item.getProduct().getImageUrl());
		response.setPrice(item.getProduct().getPrice());
		response.setQuantity(item.getQuantity());
		return response;
	}
	
	
}
