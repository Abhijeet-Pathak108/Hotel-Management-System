package com.example.demo.service;

import com.example.demo.dto.UserUpdateRequest;
import com.example.demo.entity.User;

public interface UserDetailsService {

	User updateUserDetails(UserUpdateRequest request);

	User deleteAccount(String email);

	

}
