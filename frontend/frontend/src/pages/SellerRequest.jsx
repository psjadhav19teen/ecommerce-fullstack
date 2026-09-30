import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sellerRequestAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const SellerRequest = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isSeller, isAdmin } = useAuth();

  const handleRequest = async () => {
    if (!isAuthenticated) {
      toast.info('Please login first to send a seller request.');
      navigate('/login', { state: { from: { pathname: '/seller-request' } } });
      return;
    }

    if (isSeller) {
      toast.info('Your seller account is already active.');
      navigate('/seller');
      return;
    }

    if (isAdmin) {
      toast.info('Admin account does not need a seller request.');
      navigate('/admin');
      return;
    }

    setLoading(true);
    try {
      await sellerRequestAPI.sendRequest();
      toast.success('Seller request sent successfully! Please wait for admin approval.');
      navigate('/customer');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4 text-center">
              <h2 className="mb-4">Become a Seller</h2>
              <p className="text-muted mb-4">
                Apply to become a seller on our platform. Once approved by admin, 
                you'll be able to add and manage your products.
              </p>
              
              <div className="mb-4">
                <h5>Benefits of becoming a seller:</h5>
                <ul className="text-start">
                  <li>List your products for sale</li>
                  <li>Manage your inventory</li>
                  <li>Track your sales</li>
                  <li>Reach more customers</li>
                </ul>
              </div>

              <button
                onClick={handleRequest}
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sending Request...
                  </>
                ) : (
                  'Send Seller Request'
                )}
              </button>

              <Link to="/login" className="text-decoration-none">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRequest;
