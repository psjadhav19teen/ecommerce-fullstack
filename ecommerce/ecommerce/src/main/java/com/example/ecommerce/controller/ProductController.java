package com.example.ecommerce.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController 
{
	@Autowired
	private ProductService productService;
	
	//filters
	@GetMapping
	public Page<Product> getProducts(
			@RequestParam(required = false) String category,
			@RequestParam(required = false) String subcategory,
			@RequestParam(required = false) BigDecimal minPrice,
			@RequestParam(required = false) BigDecimal maxPrice,
			@RequestParam(defaultValue ="0") int page,
			@RequestParam(defaultValue ="5") int size,
			@RequestParam(defaultValue ="id") String sortBy,
			@RequestParam(defaultValue ="asc") String direction
			)
	{
		Sort sort=direction.equalsIgnoreCase("desc")
				?Sort.by(sortBy).descending()
				:Sort.by(sortBy).ascending();
		Pageable pageable=PageRequest.of(page,size,sort);
		return productService.getProducts(category, subcategory, minPrice, maxPrice, pageable);
		
	}

	@GetMapping("/{id}")
	public Product getProductById(@PathVariable Long id)
	{
		return productService.getProductById(id);
	}

	@GetMapping("/my-products")
	@PreAuthorize("hasAnyRole('SELLER','ADMIN')")
	public List<Product> getMyProducts(Authentication auth)
	{
		return productService.getMyProducts(auth);
	}
	
	//create
	@PostMapping
	public Product addProduct(@RequestBody Product product,Authentication auth)
	{
		return productService.addProduct(product, auth);
	}
	
	//update
	@PutMapping("/{id}")
	public Product updateProduct(@PathVariable Long id,@RequestBody Product product,Authentication auth)
	{
		return productService.updateProduct(id, product, auth);
	}
	
	//delete
	@DeleteMapping("/{id}")
	public void deleteProduct(@PathVariable Long id,Authentication auth)
	{
		productService.deleteProduct(id, auth);
	}
	
	
	
	
	
}

















