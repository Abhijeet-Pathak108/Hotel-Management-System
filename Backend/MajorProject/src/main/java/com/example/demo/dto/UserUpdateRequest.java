package com.example.demo.dto;

import lombok.Data;

@Data
public class UserUpdateRequest {

    private String name;
    private String email;
    private String mobile;
    private String dateOfBirth;
    private String nationality;
    private String roomType;

    // getters & setters
}
