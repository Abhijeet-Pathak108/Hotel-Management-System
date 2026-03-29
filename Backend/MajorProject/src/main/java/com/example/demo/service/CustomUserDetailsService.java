
package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
	
	@Autowired
	private UserRepository userRepo;


    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        com.example.demo.entity.User user = userRepo.findByEmail(email);
        
        if(user == null) {
        	throw new UsernameNotFoundException("User not found");
        }

        return User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
//                .authorities(user.getRole()) 
//                .roles(user.getRole())
                .build();
    }
}
