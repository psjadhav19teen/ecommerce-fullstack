package com.example.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.ecommerce.entity.Payment;
import com.example.ecommerce.entity.User;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> 
{
	Optional<Payment> findByOrderId(Long orderid);
	
	List<Payment> findByOrderUser(User user);
}
