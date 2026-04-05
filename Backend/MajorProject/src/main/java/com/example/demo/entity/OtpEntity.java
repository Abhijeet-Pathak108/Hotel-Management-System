package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "otp_verification")
public class OtpEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String otp;

    @Column(name = "expiry_time")
    private LocalDateTime expiryTime;

    @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean verified = false;

}
