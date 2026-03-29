package com.example.demo.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
    private String role;
//    private long contactNO;
//    private String address;
//    private String Name;
}
