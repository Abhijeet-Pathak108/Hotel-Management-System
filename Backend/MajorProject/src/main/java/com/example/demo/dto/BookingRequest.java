package com.example.demo.dto;

import java.util.List;

import lombok.Data;

@Data
public class BookingRequest {

    // Room info (flattened)
    private Integer roomId;
    private String roomType;
    private Double pricePerNight;

    // User / contact
    private String guestName;
    private String email;
    private String phone;
    
    private String userEmail;

    // Stay
    private String checkIn;
    private String checkOut;
    private Integer nights;
    private Integer guestCount;

    // Pricing
    private Integer roomTotal;
    private Integer extraGuestCharge;
    private Integer taxes;
    private Integer serviceFee;
    private Integer grandTotal;
    

    // Payment
    private String paymentId;
    private String orderId;
    private String signature;
    private String paymentMethod;

    // Other
    private String specialRequest;
    private String status;
    private Boolean sendEmail;

    // 🔥 ONLY THIS IS ARRAY
    private List<GuestDTO> guests;
}
