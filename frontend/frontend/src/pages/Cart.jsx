import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI } from '../services/api';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error) {
      toast.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const getProductId = (item) => item.productId ?? item.product?.id ?? null;
  const getProductName = (item) => item.productName ?? item.product?.name ?? 'Product';
  const getProductDescription = (item) =>
    item.productDescription ?? item.product?.description ?? 'No description';
  const getProductImage = (item) => item.productImage ?? item.product?.imageUrl ?? '';
  const getUnitPrice = (item) => Number(item.price ?? item.product?.price ?? 0);

  const ensureProductId = (item, actionLabel) => {
    const productId = getProductId(item);
    if (!productId) {
      toast.error(`${actionLabel} is unavailable until the backend cart response is refreshed. Restart the backend and reload this page.`);
      return null;
    }
    return productId;
  };

  const handleIncreaseQuantity = async (item) => {
    const productId = ensureProductId(item, 'Quantity update');
    if (!productId) return;
    setActionLoading(`increase-${productId}`);
    try {
      await cartAPI.increaseQuantity(productId);
      await fetchCart();
      toast.success('Quantity increased!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to increase quantity');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecreaseQuantity = async (item) => {
    const productId = ensureProductId(item, 'Quantity update');
    if (!productId) return;
    setActionLoading(`decrease-${productId}`);
    try {
      await cartAPI.decreaseQuantity(productId);
      await fetchCart();
      toast.success('Quantity decreased!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to decrease quantity');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveFromCart = async (item) => {
    const productId = ensureProductId(item, 'Remove item');
    if (!productId) return;
    setActionLoading(`remove-${productId}`);
    try {
      await cartAPI.removeFromCart(productId);
      await fetchCart();
      toast.success('Item removed from cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePlaceOrder = async () => {
    setActionLoading('place-order');
    try {
      const response = await orderAPI.placeOrder();
      toast.success('Order placed successfully!');
      navigate(`/payment/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <Loading message="Loading cart..." />;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4">My Cart</h2>
        <div className="alert alert-info">
          Your cart is empty. <Link to="/products">Continue shopping</Link>
        </div>
      </div>
    );
  }

  const totalAmount = cart.items.reduce(
    (total, item) => total + getUnitPrice(item) * item.quantity,
    0
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Cart</h2>

      <div className="row">
        <div className="col-lg-8">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => {
                  const productId = getProductId(item);
                  const unitPrice = getUnitPrice(item);

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {getProductImage(item) && (
                            <img
                              src={getProductImage(item)}
                              alt={getProductName(item)}
                              className="me-3"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/50?text=No+Image';
                              }}
                            />
                          )}
                          <div>
                            <h6 className="mb-0">{getProductName(item)}</h6>
                            <small className="text-muted">
                              {getProductDescription(item).substring(0, 50)}...
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>Rs.{unitPrice.toFixed(2)}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleDecreaseQuantity(item)}
                            disabled={!productId || actionLoading === `decrease-${productId}` || item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleIncreaseQuantity(item)}
                            disabled={!productId || actionLoading === `increase-${productId}`}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>Rs.{(unitPrice * item.quantity).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemoveFromCart(item)}
                          disabled={!productId || actionLoading === `remove-${productId}`}
                        >
                          {actionLoading === `remove-${productId}` ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : (
                            'Remove'
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5>Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({cart.items.length} items)</span>
                <span>Rs.{totalAmount.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total</strong>
                <strong className="text-primary">Rs.{totalAmount.toFixed(2)}</strong>
              </div>
              <button
                className="btn btn-primary w-100"
                onClick={handlePlaceOrder}
                disabled={actionLoading === 'place-order'}
              >
                {actionLoading === 'place-order' ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
              <Link to="/products" className="btn btn-outline-secondary w-100 mt-2">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
