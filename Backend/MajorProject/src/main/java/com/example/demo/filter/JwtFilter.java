package com.example.demo.filter;

import java.io.IOException;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.demo.util.JwtUtil;



@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtFilter(JwtUtil jwtUtil,
                     UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.equals("/auth/login") || path.equals("/auth/refresh") || path.equals("/auth/logout")
        		|| path.equals("/auth/register") || path.startsWith("/password/forgot-password")
        		|| path.equals("/password/verify-otp") || path.equals("/password/reset-password");
    }

    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {

                // ✅ 2. Extract username AFTER validation
                String username = jwtUtil.extractUsername(token);

                // ✅ 3. Set authentication only if not already set
                if (username != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                    UserDetails userDetails =
                            userDetailsService.loadUserByUsername(username);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);
                }

            } catch (RuntimeException ex) {
                // ❌ DO NOT handle response here
                // ✅ Let AuthenticationEntryPoint handle it
            	System.out.println("JWT Filter Exception: " + ex.getMessage());
                ex.printStackTrace();
                request.setAttribute("JWT_EXCEPTION", ex);
            }
        }

        filterChain.doFilter(request, response);
    }

    

}

