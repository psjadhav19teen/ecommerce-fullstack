package com.example.ecommerce.dto;

import com.example.ecommerce.enums.Role;

public class JwtResponse 
{

	private String token;
	private Role role;
	
	public JwtResponse() {
		super();
	}
	public JwtResponse(String token, Role role) {
		super();
		this.token = token;
		this.role = role;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	
	
}
