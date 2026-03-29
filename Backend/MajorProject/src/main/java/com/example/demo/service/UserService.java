package com.example.demo.service;

import com.example.demo.dto.AuthRequest;
import com.example.demo.entity.User;

public interface UserService {

	User findByUsername(String username);

	void save(AuthRequest request);

	User findByEmail(String email);

}
