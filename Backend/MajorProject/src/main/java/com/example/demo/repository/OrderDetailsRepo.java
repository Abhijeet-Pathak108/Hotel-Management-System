package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Payment;

public interface OrderDetailsRepo extends JpaRepository<Payment, Integer> {
	
	Payment findByOrderId(String orderId);

}
