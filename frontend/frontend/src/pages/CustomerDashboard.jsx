import React from 'react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Customer Dashboard</h2>
      
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-primary h-100">
            <div className="card-body">
              <h5 className="card-title">🛍️ Products</h5>
              <p className="card-text">Browse and shop from our wide range of products</p>
              <Link to="/products" className="btn btn-light">
                View Products
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">🛒 My Cart</h5>
              <p className="card-text">View and manage items in your cart</p>
              <Link to="/cart" className="btn btn-light">
                View Cart
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-white bg-info h-100">
            <div className="card-body">
              <h5 className="card-title">📦 My Orders</h5>
              <p className="card-text">Track your order history and status</p>
              <Link to="/orders" className="btn btn-light">
                View Orders
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
                <Link to="/products" className="btn btn-outline-primary">
                  Browse Products
                </Link>
                <Link to="/cart" className="btn btn-outline-success">
                  View Cart
                </Link>
                <Link to="/orders" className="btn btn-outline-info">
                  My Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h5>Welcome to our E-Commerce Store!</h5>
            <p className="mb-0">
              Start shopping by browsing our products. Add items to your cart and proceed to checkout.
              You can also become a seller by requesting from the menu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;