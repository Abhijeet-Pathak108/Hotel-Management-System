package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Booking;
import com.example.demo.entity.GuestDetails;

public interface GuestDetailsRepository extends JpaRepository<GuestDetails, Integer> {

	List<GuestDetails> findByBooking(Booking booking);

}
