package com.example.demo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


import com.example.demo.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
	
	
	List<Booking> findByUserIdAndCheckOutBefore(Integer id, LocalDate today);

	List<Booking> findByUserIdAndCheckInAfter(Integer id, LocalDate today);

	List<Booking> findByUserId(Integer id);

	List<Booking> findByUserIdAndCheckInLessThanEqualAndCheckOutGreaterThanEqual(Integer id, LocalDate today,
			LocalDate today2);

}
