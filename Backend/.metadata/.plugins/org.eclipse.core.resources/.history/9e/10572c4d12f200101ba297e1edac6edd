package com.example.demo.controller;

import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Payment;
import com.example.demo.service.OrderDetailsService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

@RestController
public class AuthController {

	@Autowired
	private OrderDetailsService paymentService;

	@PostMapping("/create-order")
	public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) throws RazorpayException {
		RazorpayClient client = new RazorpayClient("rzp_test_S41OxbRp67UfaE", "RAqHyxEqb8xjtF0Hu6KFv18z");

		JSONObject orderRequest = new JSONObject();
		orderRequest.put("amount", (Integer) data.get("amount") * 100); // ₹100 = 10000 paise
		orderRequest.put("currency", "INR");
		orderRequest.put("receipt", "order_rcptid_11");

		Order order = client.orders.create(orderRequest);

		Payment payment = new Payment();
		payment.setOrderId(order.get("id"));
		payment.setAmount((Integer) data.get("amount"));
		payment.setCurrency("INR");
		payment.setStatus("PENDING");

		paymentService.save(payment);

		return ResponseEntity.ok(order.toString());
	}

	@PostMapping("/verify")
	public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) throws RazorpayException {
		
		String orderId = data.get("order_id");
		String paymentId = data.get("payment_id");
		String signature = data.get("signature");

		String payload = orderId + "|" + paymentId;
		
		boolean isVerified = Utils.verifySignature(payload, signature, "RAqHyxEqb8xjtF0Hu6KFv18z");

		if(isVerified) {
			
			RazorpayClient client = new RazorpayClient("rzp_test_S41OxbRp67UfaE", "RAqHyxEqb8xjtF0Hu6KFv18z");
	        com.razorpay.Payment razorpayPayment = client.payments.fetch(paymentId);

	        String method = razorpayPayment.get("method"); // <-- Correct way
	        String status = razorpayPayment.get("status"); // e.g. captured

			Payment payment = paymentService.findByOrderId(orderId)
					.orElseThrow(() -> new RuntimeException("Order not found"));

			payment.setPaymentId(paymentId);
			payment.setSignature(signature);
			payment.setStatus(status.toUpperCase());
			payment.setMethod(method);
			paymentService.save(payment);
			
			return ResponseEntity.ok("Payment Success");
		} else {
			
			return ResponseEntity.status(400).body("Invalid Signature");
		}
	}


}
