package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AuthRequest;
import com.example.demo.entity.User;
import com.example.demo.exception.UserAlreadyExistException;
import com.example.demo.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepository userRepo;
	
	@Autowired 
	private PasswordEncoder passwordEncoder;

	@Override
	public User findByUsername(String username) {
		// TODO Auto-generated method stub
		return userRepo.findByUsername(username);
	}

	@Override
	public void save(AuthRequest request) {
		// TODO Auto-generated method stub
		
		if(userRepo.findByEmail(request.getEmail()) != null) {
			throw new UserAlreadyExistException("User already exists..");
		}
		
		User user = new User();
		user.setUsername(request.getName());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setEmail(request.getEmail());
		user.setMobileNo(request.getMobileno());
		userRepo.save(user);
		
	}

	@Override
	public User findByEmail(String email) {
		// TODO Auto-generated method stub
		return userRepo.findByEmail(email);
	}

}
