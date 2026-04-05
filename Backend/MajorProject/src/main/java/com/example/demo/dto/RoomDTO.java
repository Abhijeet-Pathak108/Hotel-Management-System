package com.example.demo.dto;

import lombok.Data;

@Data
public class RoomDTO {
    private Integer id;
    private String name;
    private String type;
    private Double pricePerNight;
}
