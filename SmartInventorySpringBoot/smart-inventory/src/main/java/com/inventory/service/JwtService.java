package com.inventory.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private long expiration;

    // Generate JWT Signing Key
    private SecretKey getSigningKey() {

        byte[] keyBytes = Decoders.BASE64.decode(secret);

        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Generate JWT Token
    public String generateToken(String email, String role) {

        Date currentDate = new Date();

        Date expiryDate = new Date(
                currentDate.getTime() + expiration
        );

        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(currentDate)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    // Extract Email from Token
    public String extractEmail(String token) {

        return extractAllClaims(token).getSubject();
    }

    // Extract Role from Token
    public String extractRole(String token) {

        return extractAllClaims(token).get("role", String.class);
    }

    // Validate Token
    public boolean validateToken(String token, String email) {

        try {

            Claims claims = extractAllClaims(token);

            return claims.getSubject().equals(email)
                    && claims.getExpiration().after(new Date());

        } catch (Exception exception) {

            return false;
        }
    }

    // Extract JWT Claims
    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}