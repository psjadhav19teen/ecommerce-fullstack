package com.example.ecommerce.config;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter 
{
private final JwtUtil jwtUtil;

@Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
		throws ServletException, IOException {
	// TODO Auto-generated method stub
	
	String header=request.getHeader("Authorization");
	if(header!=null && header.startsWith("Bearer "))
	{
		String token=header.substring(7);
		if(jwtUtil.validateToken(token)) 
		{
			String email=jwtUtil.extractEmail(token);
			String role=jwtUtil.extractRole(token);
			
			UsernamePasswordAuthenticationToken auth=new 
					UsernamePasswordAuthenticationToken(email, null,List.of(new SimpleGrantedAuthority(role)));
			SecurityContextHolder.getContext().setAuthentication(auth);
		}
	}
	filterChain.doFilter(request, response);
	
}

public JwtFilter(JwtUtil jwtUtil) {
	super();
	this.jwtUtil = jwtUtil;
}






}

