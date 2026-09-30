import React, { useState, useEffect } from 'react';
import { productAPI, userAPI, sellerRequestAPI } from '../services/api';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [sellerRequests, setSellerRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Product form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    subcategory: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'sellers') {
      fetchSellerRequests();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productAPI.getAllProducts();
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.content)
          ? response.data.content
          : [];
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAllUsers();
      const data = Array.isArray(response.data) ? response.data : [];
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerRequests = async () => {
    setLoading(true);
    try {
      const response = await sellerRequestAPI.getAllRequests();
      const data = Array.isArray(response.data) ? response.data : [];
      setSellerRequests(data);
    } catch (error) {
      toast.error('Failed to fetch seller requests');
      setSellerRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productAPI.updateProduct(editingProduct.id, productForm);
        toast.success('Product updated successfully');
      } else {
        await productAPI.addProduct(productForm);
        toast.success('Product added successfully');
      }
      setProductForm({
        name: '',
        price: '',
        category: '',
        subcategory: '',
        description: '',
        imageUrl: ''
      });
      setShowProductForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error(editingProduct ? 'Failed to update product' : 'Failed to add product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      subcategory: product.subcategory || '',
      description: product.description || '',
      imageUrl: product.imageUrl || ''
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleApproveSeller = async (id) => {
    try {
      await sellerRequestAPI.approveSeller(id);
      toast.success('Seller approved successfully');
      fetchSellerRequests();
    } catch (error) {
      toast.error('Failed to approve seller');
    }
  };

  const handleRejectSeller = async (id) => {
    try {
      await sellerRequestAPI.rejectSeller(id);
      toast.success('Seller rejected successfully');
      fetchSellerRequests();
    } catch (error) {
      toast.error('Failed to reject seller');
    }
  };

  if (loading) {
    return <Loading message="Loading admin data..." />;
  }

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mb-4" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products Management
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'sellers' ? 'active' : ''}`}
            onClick={() => setActiveTab('sellers')}
          >
            Seller Requests
          </button>
        </li>
      </ul>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <button
            className="btn btn-primary mb-3"
            onClick={() => {
              setShowProductForm(true);
              setEditingProduct(null);
              setProductForm({
                name: '',
                price: '',
                category: '',
                subcategory: '',
                description: '',
                imageUrl: ''
              });
            }}
          >
            Add New Product
          </button>

          {/* Product Form */}
          {showProductForm && (
            <div className="card mb-4">
              <div className="card-header">
                <h5>{editingProduct ? 'Edit Product' : 'Add New Product'}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddProduct}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={productForm.name}
                        onChange={handleProductFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="price"
                        value={productForm.price}
                        onChange={handleProductFormChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-control"
                        name="category"
                        value={productForm.category}
                        onChange={handleProductFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Subcategory</label>
                      <input
                        type="text"
                        className="form-control"
                        name="subcategory"
                        value={productForm.subcategory}
                        onChange={handleProductFormChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={productForm.description}
                      onChange={handleProductFormChange}
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      name="imageUrl"
                      value={productForm.imageUrl}
                      onChange={handleProductFormChange}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Products List */}
          <div className="row">
            {!products || products.length === 0 ? (
              <div className="col-12">
                <p className="text-muted">No products found</p>
              </div>
            ) : (
              products.map(product => (
                <div key={product.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">
                        <strong>Category:</strong> {product.category}
                      </p>
                      <p className="card-text">
                        <strong>Price:</strong> ₹{parseFloat(product.price).toFixed(2)}
                      </p>
                      <p className="card-text small text-muted">
                        {product.description}
                      </p>
                    </div>
                    <div className="card-footer">
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditProduct(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div className="table-responsive">
            {!users || users.length === 0 ? (
              <p className="text-muted">No users found</p>
            ) : (
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Seller Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge bg-${user.role === 'ADMIN' ? 'danger' : user.role === 'SELLER' ? 'warning' : 'info'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge bg-${
                          user.sellerStatus === 'APPROVED' ? 'success' : 
                          user.sellerStatus === 'REJECTED' ? 'danger' : 
                          'warning'
                        }`}>
                          {user.sellerStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Seller Requests Tab */}
      {activeTab === 'sellers' && (
        <div>
          <div className="table-responsive">
            {!sellerRequests || sellerRequests.length === 0 ? (
              <p className="text-muted">No seller requests found</p>
            ) : (
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerRequests.map(request => (
                    <tr key={request.id}>
                      <td>{request.id}</td>
                      <td>{request.email}</td>
                      <td>
                        <span className={`badge bg-${
                          request.sellerStatus === 'APPROVED' ? 'success' : 
                          request.sellerStatus === 'REJECTED' ? 'danger' : 
                          'warning'
                        }`}>
                          {request.sellerStatus}
                        </span>
                      </td>
                      <td>
                        {request.sellerStatus === 'REQUESTED' && (
                          <>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleApproveSeller(request.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleRejectSeller(request.id)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {request.sellerStatus !== 'REQUESTED' && (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
