package com.example.demo.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.OtpEntity;
import com.example.demo.entity.User;
import com.example.demo.repository.OtpEntityRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.impl.EmailService;

@RestController
@RequestMapping("/password")
public class ChangePasswordController {
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private OtpEntityRepository otpRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@PostMapping("/forgot-password")
	public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
		

	    String email = request.get("email");

	    // 🔍 Check if user exists
	    User user = userRepository.findByEmail(email);
	    if (user.getEmail() == null) {
	        return ResponseEntity.badRequest().body("Email not registered");
	    }

	    // 🔢 Generate OTP
	    String otp = generateOtp();

	    // 💾 Save OTP
	    OtpEntity otpEntity = new OtpEntity();
	    otpEntity.setEmail(email);
	    otpEntity.setOtp(otp);
	    otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
	    otpRepository.save(otpEntity);

	    // 📩 Send Email
	    try {
	        emailService.sendOtpEmail(email, otp);
	    } catch (Exception e) {
	        return ResponseEntity.status(500).body(e.getMessage());
	    }

	    return ResponseEntity.ok("OTP sent to email");
	}
	
	public String generateOtp() {
	    int otp = (int)(Math.random() * 900000) + 100000;
	    return String.valueOf(otp);
	}
	
	@PostMapping("/verify-otp")
	public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {

	    String email = request.get("email");
	    String otp = request.get("otp");

	    OtpEntity record = otpRepository.findTopByEmailOrderByIdDesc(email);

	    if (record == null) {
	        return ResponseEntity.badRequest().body("No OTP found");
	    }

	    if (record.getExpiryTime().isBefore(LocalDateTime.now())) {
	        return ResponseEntity.badRequest().body("OTP expired");
	    }

	    if (!record.getOtp().equals(otp)) {
	        return ResponseEntity.badRequest().body("Invalid OTP");
	    }

	    return ResponseEntity.ok("OTP verified");
	}
	
	@PostMapping("/reset-password")
	public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {

	    String email = request.get("email");
	    String newPassword = request.get("newPassword");
	    String confirmPassword = request.get("confirmPassword");

	    if (!newPassword.equals(confirmPassword)) {
	        return ResponseEntity.badRequest().body("Passwords do not match");
	    }

	    User user = userRepository.findByEmail(email);
	    if (user == null) {
	        return ResponseEntity.badRequest().body("User not found");
	    }

	    // 🔐 Encrypt password (IMPORTANT)
	    user.setPassword(passwordEncoder.encode(newPassword));

	    userRepository.save(user);

	    return ResponseEntity.ok("Password reset successful");
	}
	
	public boolean verifyOtp(String email, String otp) {
	    OtpEntity record = otpRepository.findTopByEmailOrderByIdDesc(email);

	    if (record == null) return false;

	    if (record.getExpiryTime().isBefore(LocalDateTime.now()))
	        return false;

	    return record.getOtp().equals(otp);
	}
	
	

}
