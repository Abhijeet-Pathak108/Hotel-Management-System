package com.example.demo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Booking;
import com.example.demo.entity.GuestDetails;
import com.example.demo.repository.GuestDetailsRepository;

@Service
public class EmailService {

	@Autowired
	private GuestDetailsRepository guestDetailsRepo;

	@Autowired
	private JavaMailSender mailSender;

	@Value("$sender.email")
	private String senderEmail;

	@Async
	public void sendConfirmationEmail(Booking booking) {

		List<GuestDetails> guests = guestDetailsRepo.findByBooking(booking);

		StringBuilder guestInfo = new StringBuilder();

		for (GuestDetails g : guests) {
			guestInfo.append("Name: ").append(g.getName()).append(", Age: ").append(g.getAge()).append(", Gender: ")
					.append(g.getGender()).append("\n");
		}

		SimpleMailMessage message = new SimpleMailMessage();

		if (booking.getUser() == null || booking.getUser().getEmail() == null) {
			throw new RuntimeException("User email not found!");
		}

		message.setFrom(senderEmail);
		message.setTo(booking.getUser().getEmail());
		message.setSubject("Booking Confirmed 🎉");

		message.setText("Hello " + booking.getUser().getUsername() + ",\n\n" + "Your booking is confirmed!\n\n" +

				"Booking ID: " + booking.getId() + "\n" + "Check-in: " + booking.getCheckIn() + "\n" + "Check-out: "
				+ booking.getCheckOut() + "\n" + "Total: ₹" + booking.getGrandTotal() + "\n\n" +

				"Guests:\n" + guestInfo.toString() + "\n" +

				"Thank you for choosing us!");

		System.out.println("EMAIL TRIGGERED");

		mailSender.send(message);

		System.out.println("EMAIL SENT SUCCESSFULLY");
	}

	@Async
	public void sendOtpEmail(String toEmail, String otp) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(senderEmail);
		message.setTo(toEmail);
		message.setSubject("Password Reset OTP");
		message.setText("Your OTP is: " + otp + "\nValid for 5 minutes.");

		System.out.println("EMAIL TRIGGERED");

		mailSender.send(message);

		System.out.println("EMAIL SENT SUCCESSFULLY");
	}

}
