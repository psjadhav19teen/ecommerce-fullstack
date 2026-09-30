import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import SellerRequests from './pages/SellerRequests';

// Customer Pages
import CustomerDashboard from './pages/CustomerDashboard';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Payment from './pages/Payment';

// Seller Pages
import SellerDashboard from './pages/SellerDashboard';
import AddProduct from './pages/AddProduct';
import MyProducts from './pages/MyProducts';
import SellerRequest from './pages/SellerRequest';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container-fluid">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/seller-request" element={<SellerRequest />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/seller-requests" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <SellerRequests />
              </ProtectedRoute>
            } />

            {/* Customer Routes */}
            <Route path="/customer" element={
              <ProtectedRoute allowedRoles={['USER']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={
              <ProtectedRoute allowedRoles={['USER']}>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute allowedRoles={['USER']}>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/payment/:orderId" element={
              <ProtectedRoute allowedRoles={['USER']}>
                <Payment />
              </ProtectedRoute>
            } />

            {/* Seller Routes */}
            <Route path="/seller" element={
              <ProtectedRoute allowedRoles={['SELLER']}>
                <SellerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/seller/add-product" element={
              <ProtectedRoute allowedRoles={['SELLER']}>
                <AddProduct />
              </ProtectedRoute>
            } />
            <Route path="/seller/edit-product/:id" element={
              <ProtectedRoute allowedRoles={['SELLER']}>
                <AddProduct />
              </ProtectedRoute>
            } />
            <Route path="/seller/my-products" element={
              <ProtectedRoute allowedRoles={['SELLER']}>
                <MyProducts />
              </ProtectedRoute>
            } />

          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
