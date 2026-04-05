package com.example.demo.service;

import java.util.Optional;

import com.example.demo.entity.Payment;

public interface OrderDetailsService {

	void save(Payment payment);

	Payment findByOrderId(String orderId);

}
