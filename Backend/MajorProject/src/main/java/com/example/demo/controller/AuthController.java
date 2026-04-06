package com.example.demo.controller;

import java.time.Duration;
import java.util.Base64;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AuthRequest;
import com.example.demo.entity.Booking;
import com.example.demo.entity.Payment;
import com.example.demo.entity.RefreshToken;
import com.example.demo.entity.User;
import com.example.demo.exception.UserAlreadyExistException;
import com.example.demo.exception.UserNotFoundException;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.BookingService;
import com.example.demo.service.OrderDetailsService;
import com.example.demo.service.RefreshTokenService;
import com.example.demo.service.UserService;
import com.example.demo.util.JwtUtil;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

import jakarta.servlet.http.HttpServletResponse;


@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private OrderDetailsService paymentService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private RefreshTokenService refreshTokenService;
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private UserRepository userRepo;
    
    @Value("${razorpay.key_id}")
    private String keyId;

    @Value("${razorpay.key_secret}")
    private String keySecret;
    
    @GetMapping("/home")
    public String showHome() {
    	return "Welcome to JWT Authentication";
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {

        try {
        	
        	User user = userRepo.findByEmail(request.getEmail());
        	if(user.getEmail()!=null) {
        		  return ResponseEntity.badRequest().body(
        			        Map.of("status",400,"msg","User Already Registered!")
        			    );
        	}
            userService.save(request);

            return ResponseEntity.ok(Map.of("staus",200,"msg","User Registered Successfully!","result",request.getEmail()));

        } catch (UserAlreadyExistException e) {

        	return ResponseEntity.status(409).body(
        		    Map.of(
        		        "status", 409,
        		        "msg", e.getMessage()
        		    )
        		);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request,
                                   HttpServletResponse response) {
    	
    	try {
    	User user = userService.findByEmailAndDeletedFlag(request.getEmail(),0);
    	if(user == null) {
    		throw new UserNotFoundException("User not found, please register first");
    	}

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        String accessToken = jwtUtil.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.create(request.getEmail());

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken.getToken())
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
//                .maxAge(Duration.ofMinutes(1))
                .maxAge(Duration.ofDays(7))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        System.out.println(">>> Refresh cookie added: " + cookie);

        return ResponseEntity.ok(Map.of("accessToken", accessToken,"refreshToken",refreshToken.getToken(),"result",request.getEmail()));
    }catch(UserNotFoundException e) {
    	return ResponseEntity.status(401).body(Map.of("status",401,"msg",e.getMessage()));
    }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,HttpServletResponse response) {

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        RefreshToken token = refreshTokenService.verify(refreshToken);
        User user = token.getUser();

        // issue new access token
        String newAccessToken = jwtUtil.generateToken(user);

        // sliding session logic
        refreshTokenService.extend(token);
        
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(refreshTokenService.getRefreshTokenDays()*24*60*60)
//                .maxAge(refreshTokenService.getRefreshTokenMinute() * 60)  // Convert minutes to seconds
                .sameSite("Lax")
                .build();
            
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(
            Map.of("accessToken", newAccessToken)
        );
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {

        System.out.println("=== LOGOUT START ===");
        System.out.println("Token received: " + refreshToken);

        if (refreshToken != null) {
            try {
                System.out.println("Attempting to delete token from DB...");
                refreshTokenService.delete(refreshToken);
                System.out.println("Token deleted successfully");
            } catch (Exception e) {
                System.out.println("ERROR deleting token: " + e.getMessage());
                e.printStackTrace();
            }
        }

        System.out.println("Creating delete cookie...");
        
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());
        
        System.out.println("Set-Cookie header added: " + deleteCookie.toString());
        System.out.println("=== LOGOUT END ===");

        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

	@PostMapping("/create-booking")
	public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) throws RazorpayException {
		RazorpayClient client = new RazorpayClient(keyId, keySecret);

		JSONObject orderRequest = new JSONObject();
		int amount = Integer.parseInt(data.get("amount").toString());
		orderRequest.put("amount", amount * 100); // ₹100 = 10000 paise
		orderRequest.put("currency", "INR");
		orderRequest.put("receipt", "order_rcptid_11");

		Order order = client.orders.create(orderRequest);

		Payment payment = new Payment();
		payment.setOrderId(order.get("id"));
//		payment.setAmount((Integer) data.get("amount"));
		payment.setAmount(Integer.parseInt(data.get("amount").toString()));

		payment.setCurrency("INR");
		payment.setStatus("PENDING");

		paymentService.save(payment);

		return ResponseEntity.ok(order.toString());
	}
	
	@PostMapping("/verify-payment")
	public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {

	    String orderId = data.get("razorpay_order_id");
	    String paymentId = data.get("razorpay_payment_id");
	    String signature = data.get("razorpay_signature");
	    

	    // 🔐 1. Verify signature (important)
	    boolean isValid = verifySignature(orderId, paymentId, signature);

	    if (!isValid) {
	        return ResponseEntity.badRequest().body(Map.of("success", false));
	    }

	    // 🔍 2. Find payment
	    Payment payment = paymentService.findByOrderId(orderId);

	    // ✅ 3. Update payment
	    payment.setStatus("SUCCESS");
	    payment.setPaymentId(paymentId);
	    payment.setSignature(signature);
	    paymentService.save(payment);

	    // 🔥 4. CREATE BOOKING HERE
//	    Booking booking = new Booking();
//	    booking.setPayment(payment);
//	    booking.setStatus("CONFIRMED");

	    // TODO: set your fields
	    // booking.setCheckIn(...)
	    // booking.setCheckOut(...)
	    // booking.setRoom(...)
	    // booking.setGuestDetails(...)

//	    bookingService.save(booking);

	    return ResponseEntity.ok(Map.of("success", true));
	}
	
	public boolean verifySignature(String orderId, String paymentId, String razorpaySignature) {
    try {
        String secret = "Jk2ifkZbiRrEqtCTmAqxlOGb";

        String payload = orderId + "|" + paymentId;

        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        sha256_HMAC.init(secret_key);

        byte[] hash = sha256_HMAC.doFinal(payload.getBytes());

        // 🔥 Convert to HEX (NOT Base64)
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            hexString.append(String.format("%02x", b));
        }

        String generatedSignature = hexString.toString();

        return generatedSignature.equals(razorpaySignature);

    } catch (Exception e) {
        e.printStackTrace();
        return false;
    }
}

//	@PostMapping("/verify-payment")
//	public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) throws RazorpayException {
//		
//		String orderId = data.get("order_id");
//		String paymentId = data.get("payment_id");
//		String signature = data.get("signature");
//
//		String payload = orderId + "|" + paymentId;
//		
//		boolean isVerified = Utils.verifySignature(payload, signature, "RAqHyxEqb8xjtF0Hu6KFv18z");
//
//		if(isVerified) {
//			
//			RazorpayClient client = new RazorpayClient("rzp_test_S41OxbRp67UfaE", "RAqHyxEqb8xjtF0Hu6KFv18z");
//	        com.razorpay.Payment razorpayPayment = client.payments.fetch(paymentId);
//
//	        String method = razorpayPayment.get("method"); // <-- Correct way
//	        String status = razorpayPayment.get("status"); // e.g. captured
//
//			Payment payment = paymentService.findByOrderId(orderId)
//					.orElseThrow(() -> new RuntimeException("Order not found"));
//
//			payment.setPaymentId(paymentId);
//			payment.setSignature(signature);
//			payment.setStatus(status.toUpperCase());
//			payment.setMethod(method);
//			paymentService.save(payment);
//			
//			return ResponseEntity.ok("Payment Success");
//		} else {
//			
//			return ResponseEntity.status(400).body("Invalid Signature");
//		}
//	}


}
