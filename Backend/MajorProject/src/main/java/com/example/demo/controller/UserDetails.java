package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.UserUpdateRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserDetailsService;

@RestController
@RequestMapping("/user")
public class UserDetails {
	
	@Autowired
	private UserDetailsService userService;
	
	@Autowired
	private UserRepository userRepo;
	
	
	@PostMapping("/updateDetails")
	public ResponseEntity<?> updateDetails(@RequestBody UserUpdateRequest request){
//		Integer userId = request.getInt("id");
		try {
		User userData = userService.updateUserDetails(request);
		
//		JSONObject resp = new JSONObject();
//		resp.put("msg", "user details updated successfully!");
//		resp.put("status", 200);
		
		Map<String, Object> resp = new HashMap<>();
		resp.put("msg", "user details updated successfully!");
		resp.put("status", 200);
		resp.put("result", userData);

		return ResponseEntity.ok(resp);
		
		
//		return ResponseEntity.ok(resp);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Something went wrong!");
		}
	}
	
	@PostMapping("/getUserData")
	public ResponseEntity<?> getUserDetails(@RequestBody String email){
		User user = userRepo.findByEmail(email);
		
		if(user==null) {
			return ResponseEntity.status(500).body(Map.of("msg","User not exist"));
		}
		
		Map<String,Object> resp = new HashMap<>();
		resp.put("username", user.getUsername());
		resp.put("userEmail", user.getEmail());
		resp.put("mobile", user.getMobileNo());
		resp.put("dateOfBirth", user.getDateOfBirth());
		resp.put("nationality", user.getNationality());
		resp.put("roomType", user.getRoomType());
		
		
		return ResponseEntity.ok(resp);
	}
	
	@PostMapping("/deleteAccount")
	public ResponseEntity<?> deleteAccount(@RequestBody Map<String, Object> request){
		
		String email = (String) request.get("email");
		
		User user =  userService.deleteAccount(email);
		
		Map<String,Object> resp = new HashMap<>();
		resp.put("msg", "User deleted successfully!!");
		resp.put("status", 200);
		
		return ResponseEntity.ok(resp);
	}

}
