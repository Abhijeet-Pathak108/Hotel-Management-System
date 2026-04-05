package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.OtpEntity;

public interface OtpEntityRepository extends JpaRepository<OtpEntity, Integer> {

	OtpEntity findTopByEmailOrderByIdDesc(String email);


}
