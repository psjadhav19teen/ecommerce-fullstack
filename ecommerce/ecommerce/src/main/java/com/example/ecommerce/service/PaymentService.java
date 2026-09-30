package com.example.ecommerce.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.example.ecommerce.entity.Order;
import com.example.ecommerce.entity.Payment;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.enums.OrderStatus;
import com.example.ecommerce.enums.PaymentMode;
import com.example.ecommerce.enums.PaymentStatus;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.PaymentRepository;
import com.example.ecommerce.repository.UserRepository;

@Service
public class PaymentService 
{
private final UserRepository userRepository;
private final OrderRepository orderRepository;
private final PaymentRepository paymentRepository;


public List<Payment> getAllPayments()
{
	return paymentRepository.findAll();
}

public List<Payment> getMyPayments(Authentication auth)
{
	User user=userRepository.findByEmail(auth.getName()).orElseThrow(()->new RuntimeException("User not found"));
	return paymentRepository.findByOrderUser(user);
}

public Payment pay(Long orderid,PaymentMode paymentMode,Authentication auth)
{
	String email=auth.getName();
	User user=userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));
	Order order=orderRepository.findById(orderid).orElseThrow(()->new RuntimeException("Order not found"));
	if(!order.getUser().getId().equals(user.getId()))
	{
		throw new RuntimeException("You can pay only for your own orders.");
	}
	if(order.getStatus()==OrderStatus.CANCELLED)
	{
		throw new RuntimeException("Cannot pay for cancelled order");
	}
	if(order.getStatus()==OrderStatus.PAID)
	{
		throw new RuntimeException("Order already paid");
	}
	
	order.setStatus(OrderStatus.PAID);
	orderRepository.save(order);
	
	Payment payment=new Payment();
	payment.setOrder(order);
	payment.setPaymentStatus(PaymentStatus.SUCCESS);
	payment.setPaymentMode(paymentMode);
	return paymentRepository.save(payment);
	
}


public PaymentService(UserRepository userRepository, OrderRepository orderRepository,
		PaymentRepository paymentRepository) {
	super();
	this.userRepository = userRepository;
	this.orderRepository = orderRepository;
	this.paymentRepository = paymentRepository;
}


}
