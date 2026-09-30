package com.example.ecommerce.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="products")

public class Product 
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false,length=150)
	private String name;
	
	@Column(nullable = false,precision = 10,scale=2)
	private BigDecimal price;
	
	@Column(nullable = false,length=100)
	private String category;
	
	@Column(length=100)
	private String subcategory;
	
	@Column(length=1000)
	private String description;
	
	@Column(name="image_url")
	private String imageUrl;
	
	@CreationTimestamp
	@Column(name="added_date",updatable=false)
	private LocalDateTime addedDate;
	
	@UpdateTimestamp
	@Column(name="last_updated")
	private LocalDateTime lastUpdated;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getSubcategory() {
		return subcategory;
	}

	public void setSubcategory(String subcategory) {
		this.subcategory = subcategory;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public LocalDateTime getAddedDate() {
		return addedDate;
	}

	public void setAddedDate(LocalDateTime addedDate) {
		this.addedDate = addedDate;
	}

	public LocalDateTime getLastUpdated() {
		return lastUpdated;
	}

	public void setLastUpdated(LocalDateTime lastUpdated) {
		this.lastUpdated = lastUpdated;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="seller_id",foreignKey = @ForeignKey(name="fk_product_seller"))
	@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
	private User seller;

	public Product(Long id, String name, BigDecimal price, String category, String subcategory, String description,
			String imageUrl, LocalDateTime addedDate, LocalDateTime lastUpdated, User seller) {
		super();
		this.id = id;
		this.name = name;
		this.price = price;
		this.category = category;
		this.subcategory = subcategory;
		this.description = description;
		this.imageUrl = imageUrl;
		this.addedDate = addedDate;
		this.lastUpdated = lastUpdated;
		this.seller = seller;
	}

	public Product() {
		super();
	}

	public User getSeller() {
		return seller;
	}

	public void setSeller(User seller) {
		this.seller = seller;
	}
	
	

}






