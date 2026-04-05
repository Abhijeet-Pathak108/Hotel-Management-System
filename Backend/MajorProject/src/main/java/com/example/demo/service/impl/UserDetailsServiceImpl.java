package com.example.demo.service.impl;

import java.time.LocalDate;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.UserUpdateRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserDetailsService;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private UserRepository userRepo;

	@Override
	public User updateUserDetails(UserUpdateRequest request) {

		User user = userRepo.findByEmail(request.getEmail());

		user.setUsername(request.getName());
		user.setMobileNo(request.getMobile());

		if (request.getDateOfBirth() != null && !request.getDateOfBirth().trim().isEmpty()) {
		    LocalDate dob = LocalDate.parse(request.getDateOfBirth());
		    user.setDateOfBirth(dob);
		} else {
		    user.setDateOfBirth(null); // or skip setting
		}

		user.setNationality(request.getNationality());
		user.setRoomType(request.getRoomType());

		return userRepo.save(user);
	}

	@Override
	public User deleteAccount(String email) {

		User user = userRepo.findByEmail(email);
		user.setDeletedFlag(1);
		userRepo.save(user);
		
		return user;
		
	}

}
