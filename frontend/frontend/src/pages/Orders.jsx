import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'info';
      case 'SHIPPED':
        return 'primary';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

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
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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

  if (loading) {
    return <Loading message="Loading orders..." />;
  }

  if (orders.length === 0) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4">My Orders</h2>
        <div className="alert alert-info">
          You haven't placed any orders yet. <Link to="/products">Start shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Orders</h2>
      
      <div className="row">
        {orders.map((order) => (
          <div key={order.id} className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <strong>Order #{order.id}</strong>
                  <br />
                  <small className="text-muted">
                    {formatDate(order.orderDate)}
                  </small>
                </div>
                <span className={`badge bg-${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="card-body">
                <h6>Order Items:</h6>
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item, index) => (
                    <div key={index} className="d-flex justify-content-between mb-2">
                      <span>
                        {item.productName || 'Product'} x {item.quantity}
                      </span>
                      <span>₹{formatAmount(item.price * item.quantity)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No items</p>
                )}
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong>₹{formatAmount(order.totalAmount)}</strong>
                </div>
                
                {order.payment && (
                  <div className="mt-2">
                    <small className="text-muted">
                      Payment: {order.payment.paymentStatus} ({order.payment.paymentMode})
                    </small>
                  </div>
                )}
              </div>
              <div className="card-footer bg-white">
                {order.orderStatus === 'PENDING' && !order.payment && (
                  <Link
                    to={`/payment/${order.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Pay Now
                  </Link>
                )}
                {order.payment?.paymentStatus === 'PENDING' && (
                  <Link
                    to={`/payment/${order.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Retry Payment
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;