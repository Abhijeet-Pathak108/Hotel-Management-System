package com.example.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Payment;
import com.example.demo.repository.OrderDetailsRepo;

@Service
public class OrderDetailsServiceImpl implements OrderDetailsService {
	
	@Autowired
	private OrderDetailsRepo paymentRepository;

	@Override
	public void save(Payment payment) {
		paymentRepository.save(payment);
		
	}

	@Override
	public Payment findByOrderId(String orderId) {

		return paymentRepository.findByOrderId(orderId);
	}

}
