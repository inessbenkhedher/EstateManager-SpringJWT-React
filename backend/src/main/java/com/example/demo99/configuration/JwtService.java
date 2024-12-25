package com.example.demo99.configuration;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService{

    @Value("3000")
    private long expiration; // Expiration in seconds

    @Value("${spring.app.secretkey}")
    private String secretkey;

    // Extract token from header
    public String getTokenFromHeader(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            return token.substring(7); // Remove "Bearer " prefix
        }
        return null;
    }

    // Generate token
    public String generateToken(UserDetails userDetails, Long userId) {

        Map<String,Object> claims=new HashMap<>();
        claims.put("roles", userDetails.getAuthorities().stream().map(x -> x.getAuthority()).toList());
        claims.put("userId", userId);
        return Jwts.builder()
                .setClaims(claims) // Add claims map
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(key())
                .compact();
    }


    // Extract username (email) from token
    public String extractEmail(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    // Validate token
    public boolean validateToken(String token, UserDetails userDetails) {
        final String email = extractEmail(token);
        return email.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // Check if token is expired
    private boolean isTokenExpired(String token) {
        return getClaimsFromToken(token).getExpiration().before(new Date());
    }

    // Extract all claims
    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Date getExpirationNameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }

    // Generate signing key
    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretkey));
    }
}

