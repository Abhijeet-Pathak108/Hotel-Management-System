package com.example.demo.service.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.example.demo.dto.BookingRequest;
import com.example.demo.dto.GuestDTO;
import com.example.demo.entity.Booking;
import com.example.demo.entity.GuestDetails;
import com.example.demo.entity.Payment;
import com.example.demo.entity.User;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.GuestDetailsRepository;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.BookingService;

@Service
public class BookingServiceImpl implements BookingService {

	@Autowired
	private BookingRepository bookingRepo;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private GuestDetailsRepository guestDetailsRepo;

	@Autowired
	private PaymentRepository paymentRepo;
	
	@Autowired
	private EmailService emailService;

	@Override
	public void save(Booking booking) {
		bookingRepo.save(booking);

	}

	@Override
	public BookingRequest saveGuest(BookingRequest request) {
		
		

		Booking booking = new Booking();
		Payment payment = paymentRepo.findByPaymentId(request.getPaymentId());

		String email = request.getUserEmail();

		User user = userRepo.findByEmail(email);

		booking.setUser(user);
		booking.setRoomType(request.getRoomType());
		booking.setCheckIn(LocalDate.parse(request.getCheckIn()));
		booking.setCheckOut(LocalDate.parse(request.getCheckOut()));
		booking.setNights(request.getNights());
		booking.setGuestCount(request.getGuestCount());
		booking.setRoomTotal(request.getRoomTotal());
		booking.setExtraGuestCharge(request.getExtraGuestCharge());
		booking.setTaxes(request.getTaxes());
		booking.setServiceFee(request.getServiceFee());
		booking.setGrandTotal(request.getGrandTotal());
		booking.setSpecialRequest(request.getSpecialRequest());
		booking.setPayment(payment);
//		booking.setStatus( request.getStatus());
		bookingRepo.save(booking);

		List<GuestDTO> guest = request.getGuests();

		for (GuestDTO g : guest) {
			GuestDetails guestDetails = new GuestDetails();
			guestDetails.setBooking(booking);
			guestDetails.setName(g.getName());
			guestDetails.setAge(g.getAge());
			guestDetails.setGender(g.getGender());
			guestDetails.setIdType(g.getIdType());
			guestDetails.setIdNumber(g.getIdNumber());
			guestDetails.setNationality(g.getNationality());
			guestDetails.setIsPrimary(g.getIsPrimary());
			guestDetailsRepo.save(guestDetails);

		}
		
		if (Boolean.TRUE.equals(request.getSendEmail())) {
		    
		        try {
		            emailService.sendConfirmationEmail(booking);
		        } catch (Exception e) {
		            e.printStackTrace();
		        }
		   
		}

		return request;
	}
	

	@Override
	public List<Map<String, Object>> getCompletedBooking(Integer id) {

		LocalDate today = LocalDate.now();

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

		List<Booking> bookings = bookingRepo.findByUserIdAndCheckOutBefore(id, today);

		List<Map<String, Object>> jsonArray = new ArrayList<>();

		for (Booking b : bookings) {
			Map<String, Object> obj = new HashMap<>();

			String formatted = b.getCheckIn().format(formatter) + " – " + b.getCheckOut().format(formatter) + ", "
					+ b.getCheckOut().getYear();

//		    obj.put("bookingId", b.getId());
			obj.put("room", b.getRoomType());
			obj.put("checkIn", b.getCheckIn());
			obj.put("checkOut", b.getCheckOut());
			obj.put("dates", formatted);
			obj.put("guests", b.getGuestCount());
			obj.put("nights", b.getNights());
			obj.put("price", b.getGrandTotal());
			obj.put("status", "COMPLETED");

			jsonArray.add(obj);
		}

		return jsonArray;
	}

	@Override
	public List<Map<String, Object>> getUpcomingBookings(Integer id) {
		LocalDate today = LocalDate.now();

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

		List<Booking> bookings = bookingRepo.findByUserIdAndCheckInAfter(id, today);

		List<Map<String, Object>> jsonArray = new ArrayList<>();

		for (Booking b : bookings) {
			Map<String, Object> obj = new HashMap<>();

			String formatted = b.getCheckIn().format(formatter) + " – " + b.getCheckOut().format(formatter) + ", "
					+ b.getCheckOut().getYear();

//		    obj.put("bookingId", b.getId());
			obj.put("room", b.getRoomType());
			obj.put("checkIn", b.getCheckIn());
			obj.put("checkOut", b.getCheckOut());
			obj.put("dates", formatted);
			obj.put("guests", b.getGuestCount());
			obj.put("nights", b.getNights());
			obj.put("price", b.getGrandTotal());
			obj.put("status",  "CONFIRMED");

			jsonArray.add(obj);
		}

		return jsonArray;
	}

	@Override
	public List<Map<String, Object>> getAllBookings(Integer id) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
		
		LocalDate today = LocalDate.now();

		List<Booking> bookings = bookingRepo.findByUserId(id);

		List<Map<String, Object>> jsonArray = new ArrayList<>();

		for (Booking b : bookings) {
			Map<String, Object> obj = new HashMap<>();

			String formatted = b.getCheckIn().format(formatter) + " – " + b.getCheckOut().format(formatter) + ", "
					+ b.getCheckOut().getYear();

//		    obj.put("bookingId", b.getId());
			obj.put("room", b.getRoomType());
			obj.put("checkIn", b.getCheckIn());
			obj.put("checkOut", b.getCheckOut());
			obj.put("dates", formatted);
			obj.put("guests", b.getGuestCount());
			obj.put("nights", b.getNights());
			obj.put("price", b.getGrandTotal());
			if (b.getCheckOut().isBefore(today)) {
				obj.put("status",  "COMPLETED");
		    } else if (b.getCheckIn().isAfter(today)) {
		    	obj.put("status",  "CONFIRMED");
		    } else {
		    	obj.put("status",  "ONGOING");
		    }

			jsonArray.add(obj);
		}

		return jsonArray;
	}

	@Override
	public List<Map<String, Object>> getOngoingdBooking(Integer id) {
		LocalDate today = LocalDate.now();

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

		List<Booking> bookings =
			    bookingRepo.findByUserIdAndCheckInLessThanEqualAndCheckOutGreaterThanEqual(
			        id, today, today
			    );

		List<Map<String, Object>> jsonArray = new ArrayList<>();

		for (Booking b : bookings) {
			Map<String, Object> obj = new HashMap<>();

			String formatted = b.getCheckIn().format(formatter) + " – " + b.getCheckOut().format(formatter) + ", "
					+ b.getCheckOut().getYear();

//		    obj.put("bookingId", b.getId());
			obj.put("room", b.getRoomType());
			obj.put("checkIn", b.getCheckIn());
			obj.put("checkOut", b.getCheckOut());
			obj.put("dates", formatted);
			obj.put("guests", b.getGuestCount());
			obj.put("nights", b.getNights());
			obj.put("price", b.getGrandTotal());
			obj.put("status", "ONGOING");

			jsonArray.add(obj);
		}

		return jsonArray;
	}

}
