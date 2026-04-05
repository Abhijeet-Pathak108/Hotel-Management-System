package com.example.demo.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.BookingRequest;
import com.example.demo.entity.Booking;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.BookingService;

@RequestMapping("/booking")
@RestController
public class BookingController {

	@Autowired
	private BookingService bookingService;

	@Autowired
	private UserRepository userRepo;

	@PostMapping("/saveBooking")
	public ResponseEntity<?> saveBookingDetails(@RequestBody BookingRequest request) {

		try {
			BookingRequest bookingData = bookingService.saveGuest(request);

			Map<String, Object> resp = new HashMap<>();
			resp.put("msg", "booking details saved successfully!");
			resp.put("status", 200);
			resp.put("result", bookingData);

			return ResponseEntity.ok(resp);
		} catch (Exception e) {
			return ResponseEntity.status(500).body("something went wrong");
		}
	}
	
	@PostMapping("/ongoingBookings")
	public ResponseEntity<?> showOngoingBookings(@RequestBody Map<String, Object> request){
		

		String email = (String) request.get("email");

		Integer id = userRepo.findByEmail(email).getId();

		List<Map<String, Object>> booking = bookingService.getOngoingdBooking(id);

		Map<String, Object> resp = new HashMap<>();
		

		resp.put("msg", "Ongoing Bookings fetched successfully!");
		resp.put("status", 200);
		resp.put("result", booking);

		return ResponseEntity.ok(resp);
		
	}

	@PostMapping("/completedBooking")
	public ResponseEntity<?> showCompletedBooking(@RequestBody Map<String, Object> request) {

		String email = (String) request.get("email");

		Integer id = userRepo.findByEmail(email).getId();

		List<Map<String, Object>> booking = bookingService.getCompletedBooking(id);

		Map<String, Object> resp = new HashMap<>();
		

		resp.put("msg", "Completed Bookings fetched successfully!");
		resp.put("status", 200);
		resp.put("result", booking);

		return ResponseEntity.ok(resp);
	}

	@PostMapping("/upcomingBookings")
	public ResponseEntity<?> showUpcomingBookings(@RequestBody Map<String, Object> request) {
		
		String email = (String) request.get("email");

		Integer id = userRepo.findByEmail(email).getId();

		List<Map<String, Object>> booking = bookingService.getUpcomingBookings(id);

		Map<String, Object> resp = new HashMap<>();

		resp.put("msg", "Upcoming Bookings fetched successfully!");
		resp.put("status", 200);
		resp.put("result", booking);

		return ResponseEntity.ok(resp);
	}
	
	@PostMapping("/allBookings")
	public ResponseEntity<?> showAllBookings(@RequestBody Map<String, Object> request) {
		
		String email = (String) request.get("email");

		Integer id = userRepo.findByEmail(email).getId();

		List<Map<String, Object>> booking = bookingService.getAllBookings(id);

		Map<String, Object> resp = new HashMap<>();

		resp.put("msg", "All Bookings fetched successfully!");
		resp.put("status", 200);
		resp.put("result", booking);

		return ResponseEntity.ok(resp);
	}

}
