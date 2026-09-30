package com.example.ecommerce.config;


import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.example.ecommerce.enums.Role;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;

@Component
public class JwtUtil 
{

	@Value("${jwt.secret}")
	private String secret;
	
	@Value("${jwt.expiration}")
	private long expiration;
	
	private SecretKey getSigningKey()
	{
		return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}
	
	public String generateToken(String email,Role role)
	{
		return Jwts.builder()
				.setSubject(email)
				.claim("role","ROLE_"+role.name())
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis()+expiration))
				.signWith(getSigningKey(),SignatureAlgorithm.HS256)
				.compact();
	}
	
	private Claims getClaims(String token)
	{
		return Jwts.parserBuilder()
				.setSigningKey(getSigningKey())
				.build()
				.parseClaimsJws(token)
				.getBody();
	}
	
	public String extractEmail(String token)
	{
		return getClaims(token).getSubject();
	}
	
	public String extractRole(String token)
	{
		return getClaims(token).get("role",String.class);
	}
	
	public boolean validateToken(String token)
	{
		try {
			getClaims(token);
			return true;
		}
		catch (Exception e) {
			return false;
		}
	}

	public JwtUtil(String secret, long expiration) {
		super();
		this.secret = secret;
		this.expiration = expiration;
	}

	public JwtUtil() {
		super();
	}
	
	
	
	
}
