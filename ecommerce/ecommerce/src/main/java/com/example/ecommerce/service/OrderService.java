package com.example.ecommerce.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.example.ecommerce.entity.Cart;
import com.example.ecommerce.entity.CartItem;
import com.example.ecommerce.entity.Order;
import com.example.ecommerce.entity.OrderItem;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.enums.OrderStatus;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.UserRepository;

@Service
public class OrderService 
{
	private final CartRepository cartRepository;
	private final OrderRepository orderRepository;
	private final UserRepository userRepository;
	
	
	public List<Order> getMyOrders(Authentication auth)
	{
		String email =auth.getName();
		User user=userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));
		return orderRepository.findByUser(user);
	}
	
	public Order getOrderById(Long orderid,Authentication auth)
	{
		String email=auth.getName();
		
		User user=userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));
		Order order=orderRepository.findById(orderid).orElseThrow(()->new RuntimeException("Order not found"));
		
		if(!order.getUser().getId().equals(user.getId()))
		{
			throw new RuntimeException("Access denied");
		}
		return order;
	}

	public Order placeOrder(Authentication auth)
	{
		String email=auth.getName();
		User user=userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));
		Cart cart=cartRepository.findByUser(user).orElseThrow(()->new RuntimeException("Cart not found"));
		
		if(cart.getItems().isEmpty())
		{
			throw new RuntimeException("Cart is empty");
		}
		Order order=new Order();
		order.setUser(user);
		order.setStatus(OrderStatus.CREATED);
		order.setOrderdate(LocalDateTime.now());
		
		List<OrderItem> orderItems=new ArrayList<>();
		BigDecimal total=BigDecimal.ZERO;
		
		for(CartItem cartItem:cart.getItems())
		{
			OrderItem item=new OrderItem();
			item.setOrder(order);
			item.setProduct(cartItem.getProduct());
			item.setQuantity(cartItem.getQuantity());
			item.setPrice(cartItem.getProduct().getPrice());
			total=total.add(cartItem.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
			orderItems.add(item);
		}
		
		order.setItems(orderItems);
		order.setTotalamount(total);
		Order savedOrder=orderRepository.save(order);
		cart.getItems().clear();
		cartRepository.save(cart);
		return savedOrder;
	}
	
	public Order cancelOrder(Long orderid,Authentication auth)
	{
		String email=auth.getName();
		User user=userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));
		Order order=orderRepository.findById(orderid).orElseThrow(()->new RuntimeException("Order not found"));
		if(!order.getUser().getId().equals(user.getId()))
		{
			throw new RuntimeException("Access Denined");
		}
		
		if(order.getStatus()!=OrderStatus.CREATED)
		{
			throw new RuntimeException("Order cannot be cancelled");
		}
		
		order.setStatus(OrderStatus.CANCELLED);
		return orderRepository.save(order);
		
	}
		

	public OrderService(CartRepository cartRepository, OrderRepository orderRepository, UserRepository userRepository) {
		super();
		this.cartRepository = cartRepository;
		this.orderRepository = orderRepository;
		this.userRepository = userRepository;
	}

	
}
