package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "room_type")
    private String roomType;

    private String guestName;

    private String email;

    private String phone;

    private LocalDate checkIn;

    private LocalDate checkOut;

    private Integer guestCount;

    private Integer nights;

    private Integer roomTotal;

    private Integer extraGuestCharge;

    private Integer taxes;

    private Integer serviceFee;

    private Integer grandTotal;
    
    @Column(name = "special_request")
    private String specialRequest;

    private String status; // CONFIRMED / CANCELLED

    // 🔥 Relationship with Payment
    @OneToOne
    @JoinColumn(name = "payment_id")
    private Payment payment;

    // getters & setters
}