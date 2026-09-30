import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, isAdmin, isSeller, isUser } = useAuth();

  if (isAuthenticated) {
    if (isAdmin) return <Navigate to="/admin" replace />;
    if (isSeller) return <Navigate to="/seller" replace />;
    if (isUser) return <Navigate to="/customer" replace />;
  }

  return (
    <div className="container py-5">
      <div className="row align-items-center min-vh-75 py-5">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <span className="badge bg-primary-subtle text-primary mb-3">
            Online Shopping
          </span>
          <h1 className="display-5 fw-bold mb-3">Shop your next favorite product</h1>
          <p className="lead text-muted mb-4">
            Browse products, compare prices, and place orders with a smooth checkout flow.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <Link to="/products" className="btn btn-primary btn-lg">
              Browse Products
            </Link>
            <Link to="/login" className="btn btn-outline-dark btn-lg">
              Login
            </Link>
            <Link to="/register" className="btn btn-outline-secondary btn-lg">
              Create Account
            </Link>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="row g-3">
            <div className="col-sm-6">
              <div className="card shadow-sm h-100 border-0 bg-primary text-white">
                <div className="card-body">
                  <h5 className="card-title">Easy browsing</h5>
                  <p className="card-text mb-0">
                    Explore product listings before signing in.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="card shadow-sm h-100 border-0 bg-success text-white">
                <div className="card-body">
                  <h5 className="card-title">Quick checkout</h5>
                  <p className="card-text mb-0">
                    Login when you are ready to add items and place orders.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <h5 className="card-title mb-3">Why start here?</h5>
                  <p className="card-text text-muted mb-0">
                    Guests can discover the catalog first, and signed-in customers go straight to
                    their dashboard after login.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
