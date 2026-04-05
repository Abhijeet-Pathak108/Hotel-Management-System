package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.json.JSONArray;

import com.example.demo.dto.BookingRequest;
import com.example.demo.entity.Booking;

public interface BookingService {

	void save(Booking booking);

	BookingRequest saveGuest(BookingRequest request);

	List<Map<String,Object>> getCompletedBooking(Integer id);

	List<Map<String, Object>> getUpcomingBookings(Integer id);

	List<Map<String, Object>> getAllBookings(Integer id);

	List<Map<String, Object>> getOngoingdBooking(Integer id);

}
