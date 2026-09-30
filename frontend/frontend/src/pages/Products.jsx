import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../services/api';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [addingToCart, setAddingToCart] = useState(null);
  const { isAuthenticated, isUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAllProducts();
      const productList = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.content)
          ? response.data.content
          : [];
      setProducts(productList);
    } catch (error) {
      setProducts([]);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.info('Please login to add products to your cart.');
      navigate('/login', { state: { from: { pathname: '/products' } } });
      return;
    }

    if (!isUser) {
      toast.error('Only customers can add products to the cart.');
      return;
    }

    setAddingToCart(productId);
    try {
      await cartAPI.addToCart(productId);
      toast.success('Product added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading message="Loading products..." />;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Products</h2>
      
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="alert alert-info">
          No products found.
        </div>
      ) : (
        <div className="row">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                    }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted">
                    {product.description?.substring(0, 100)}...
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 text-primary mb-0">
                      ₹{product.price}
                    </span>
                    <span className="badge bg-secondary">
                      {product.category || 'General'}
                    </span>
                  </div>
                  <p className="mt-2 mb-0">
                    <small className="text-muted">
                      Seller: {product.sellerName || 'Unknown'}
                    </small>
                  </p>
                </div>
                <div className="card-footer bg-white">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={addingToCart === product.id}
                  >
                    {addingToCart === product.id ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding...
                      </>
                    ) : (
                      isAuthenticated && isUser ? 'Add to Cart' : 'Login to Add'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
