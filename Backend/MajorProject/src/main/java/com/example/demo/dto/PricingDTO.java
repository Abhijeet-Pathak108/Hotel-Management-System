package com.example.demo.dto;

import lombok.Data;

@Data
public class PricingDTO {
    private Double roomTotal;
    private Double taxes;
    private Double extraGuestCharge;
    private Double serviceFee;
    private Double grandTotal;
}
