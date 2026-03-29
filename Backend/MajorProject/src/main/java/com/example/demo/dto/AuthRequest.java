package com.example.demo.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String name;
    private String password;
    private String email;
    private String mobileno;
//    private long contactNO;
//    private String address;
//    private String Name;
}
