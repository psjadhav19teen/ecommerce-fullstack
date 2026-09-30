package com.example.ecommerce.dto;

public class RegisterRequest 
{
private String email;
private String password;

public RegisterRequest() {
	super();
}
public RegisterRequest(String email, String password) {
	super();
	this.email = email;
	this.password = password;
}
public String getEmail() {
	return email;
}
public void setEmail(String email) {
	this.email = email;
}
public String getPassword() {
	return password;
}
public void setPassword(String password) {
	this.password = password;
}

}
