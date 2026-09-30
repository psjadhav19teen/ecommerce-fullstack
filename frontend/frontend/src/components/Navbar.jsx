import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isSeller, isUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isSeller) return '/seller';
    if (isUser) return '/customer';
    return '/';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to={getDashboardLink()}>
          🛒 E-Commerce
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-light">
                    Welcome, {user?.name} ({user?.role})
                  </span>
                </li>
                
                {/* Admin Links */}
                {isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin">
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/seller-requests">
                        Seller Requests
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/products">
                        All Products
                      </Link>
                    </li>
                  </>
                )}

                {/* Seller Links */}
                {isSeller && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/seller">
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/seller/add-product">
                        Add Product
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/seller/my-products">
                        My Products
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/products">
                        All Products
                      </Link>
                    </li>
                  </>
                )}

                {/* User Links */}
                {isUser && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/customer">
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/products">
                        Products
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/cart">
                        🛒 Cart
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/orders">
                        Orders
                      </Link>
                    </li>
                  </>
                )}

                <li className="nav-item">
                  <button 
                    className="btn btn-outline-light btn-sm ms-2" 
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/products">
                    Products
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/seller-request">
                    Become Seller
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
