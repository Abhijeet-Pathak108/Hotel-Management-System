package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

	User findByUsername(String username);

	

	boolean existsByUsername(String username);



	boolean existsByMobileNo(String mobileNo);



	User findByEmail(String email);
	
	

}
