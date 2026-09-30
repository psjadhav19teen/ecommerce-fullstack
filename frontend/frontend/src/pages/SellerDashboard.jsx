import React from 'react';
import { Link } from 'react-router-dom';

const SellerDashboard = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Seller Dashboard</h2>
      
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-primary h-100">
            <div className="card-body">
              <h5 className="card-title">➕ Add Product</h5>
              <p className="card-text">Add a new product to your inventory</p>
              <Link to="/seller/add-product" className="btn btn-light">
                Add Product
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">📦 My Products</h5>
              <p className="card-text">View and manage your products</p>
              <Link to="/seller/my-products" className="btn btn-light">
                View Products
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-white bg-info h-100">
            <div className="card-body">
              <h5 className="card-title">🛒 All Products</h5>
              <p className="card-text">Browse all products in the store</p>
              <Link to="/products" className="btn btn-light">
                View All
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-flex gap-2 flex-wrap">
                <Link to="/seller/add-product" className="btn btn-outline-primary">
                  Add New Product
                </Link>
                <Link to="/seller/my-products" className="btn btn-outline-success">
                  Manage My Products
                </Link>
                <Link to="/products" className="btn btn-outline-info">
                  View All Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-success">
            <h5>Welcome to Seller Dashboard!</h5>
            <p className="mb-0">
              Start by adding your products. You can manage your inventory, update prices, 
              and track your sales from this dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;