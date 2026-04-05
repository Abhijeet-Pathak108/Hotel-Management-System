package com.example.demo.dto;

import lombok.Data;

@Data
public class GuestDTO {
    private String name;
    private Integer age;
    private String gender;
    private String idType;
    private String idNumber;
    private String nationality;
    private Boolean isPrimary;
}
