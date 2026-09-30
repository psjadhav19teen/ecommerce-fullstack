import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orderAPI, paymentAPI } from '../services/api';
import { openRazorpayCheckout } from '../utils/razorpayUtils';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMode, setPaymentMode] = useState('UPI');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatAmount = (amount) => {
    if (!amount) return '0';
    const num = parseFloat(amount);
    return isNaN(num) ? '0' : num.toFixed(2);
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getOrderById(orderId);
      setOrder(response.data);
    } catch (error) {
      toast.error('Failed to fetch order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // First, call backend to create payment
      const response = await paymentAPI.processPayment(orderId, paymentMode);
      
      // If backend returns Razorpay order details, use them
      if (response.data && response.data.razorpayOrderId) {
        const razorpayOrderId = response.data.razorpayOrderId;
        const amount = order.totalAmount;

        // Open Razorpay checkout
        const razorpayResponse = await openRazorpayCheckout({
          order_id: razorpayOrderId,
          amount: amount * 100, // Convert to paise
          name: 'E-Commerce Payment',
          description: `Payment for Order #${orderId}`,
          prefill: {
            // Add user details if available
          },
        });

        // Payment successful - verify with backend
        await paymentAPI.processPayment(orderId, paymentMode);
        toast.success('Payment successful!');
        navigate('/orders');
      } else {
        // If no Razorpay integration from backend, simulate success
        toast.success('Payment processed successfully!');
        navigate('/orders');
      }
    } catch (error) {
      console.error('Payment error:', error);
      if (error.message !== 'Payment cancelled by user') {
        toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  // Alternative: Direct Razorpay payment without backend order creation
  const handleDirectPayment = async () => {
    if (!order || !order.totalAmount) {
      toast.error('Order total amount is not available');
      return;
    }

    setProcessing(true);
    try {
      // Ensure amount is a number and convert to paise
      const amountInRupees = parseFloat(order.totalAmount);
      const amountInPaise = Math.round(amountInRupees * 100);

      if (amountInPaise <= 0) {
        toast.error('Invalid order amount');
        setProcessing(false);
        return;
      }

      // Open Razorpay checkout directly
      const razorpayResponse = await openRazorpayCheckout({
        amount: amountInPaise,
        currency: 'INR',
        name: 'E-Commerce Payment',
        description: `Payment for Order #${orderId}`,
        prefill: {
          // Add user details if available
        },
      });

      // Payment successful - call backend to confirm
      await paymentAPI.processPayment(orderId, paymentMode);
      toast.success('Payment successful!');
      navigate('/orders');
    } catch (error) {
      console.error('Payment error:', error);
      if (error.message !== 'Payment cancelled by user') {
        toast.error('Payment failed. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <Loading message="Loading payment details..." />;
  }

  if (!order) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">Order not found</div>
        <Link to="/orders" className="btn btn-primary">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Payment</h4>
            </div>
            <div className="card-body">
              <h5 className="mb-3">Order Summary</h5>
              
              <div className="mb-3">
                <strong>Order ID:</strong> #{order.id}
              </div>
              
              <div className="mb-3">
                <strong>Order Date:</strong>{' '}
                {formatDate(order.orderDate)}
              </div>

              <hr />

              <h6>Items:</h6>
              {order.orderItems && order.orderItems.length > 0 ? (
                order.orderItems.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between mb-2">
                    <span>{item.productName || 'Product'} x {item.quantity}</span>
                    <span>₹{formatAmount(item.price * item.quantity)}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted">No items</p>
              )}

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <strong>Total Amount:</strong>
                <strong className="text-primary h4 mb-0">₹{formatAmount(order.totalAmount)}</strong>
              </div>

              <div className="mb-4">
                <label className="form-label"><strong>Payment Mode:</strong></label>
                <select
                  className="form-select"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  <option value="UPI">UPI</option>
                  <option value="CARD">Card</option>
                  <option value="NETBANKING">Net Banking</option>
                  <option value="COD">Cash on Delivery</option>
                </select>
              </div>

              <div className="alert alert-info">
                <small>
                  <strong>Test Payment:</strong> Use Razorpay test credentials.<br />
                  Key ID: rzp_test_D7ANXcGhfhhYf1
                </small>
              </div>

              <button
                className="btn btn-primary w-100 btn-lg"
                onClick={handleDirectPayment}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹${formatAmount(order.totalAmount)}`
                )}
              </button>

              <Link to="/orders" className="btn btn-outline-secondary w-100 mt-2">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;