package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "guest_details")
@Data
public class GuestDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 🔥 MANY guests → ONE booking
    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    private String name;
    private Integer age;
    private String gender;

    @Column(name = "id_type")
    private String idType;

    @Column(name = "id_number")
    private String idNumber;

    private String nationality;

    @Column(name = "is_primary")
    private Boolean isPrimary;
}
