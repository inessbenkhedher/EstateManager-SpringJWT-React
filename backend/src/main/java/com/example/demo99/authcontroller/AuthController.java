package com.example.demo99.authcontroller;


import com.example.demo99.configuration.JwtService;
import com.example.demo99.entities.Client;
import com.example.demo99.service.ServiceClient;
import lombok.AllArgsConstructor;
import org.antlr.v4.runtime.atn.ActionTransition;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@AllArgsConstructor

public class AuthController {


    private AuthenticationManager authenticationManager;
    private  JwtService jwtService;
    private ServiceClient serviceClient;
   private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            // Authenticate user credentials
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getEmail(),
                            authRequest.getPassword()
                    )
            );

            // Generate JWT for authenticated user
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Client client = serviceClient.findClientByEmail(authRequest.getEmail()); // Fetch user to get ID

            // Generate JWT token with userId
            String token = jwtService.generateToken(userDetails, client.getId());
            return ResponseEntity.ok(Map.of("token", token));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }
}
