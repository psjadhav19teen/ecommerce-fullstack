import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productAPI } from '../services/api';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  subcategory: '',
  imageUrl: '',
};

const AddProduct = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(isEditMode);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEditMode) {
      setFetchingProduct(false);
      return;
    }

    const loadProduct = async () => {
      try {
        const response = await productAPI.getProductById(id);
        const product = response.data;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price ?? '',
          category: product.category || '',
          subcategory: product.subcategory || '',
          imageUrl: product.imageUrl || '',
        });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load product');
        navigate('/seller/my-products');
      } finally {
        setFetchingProduct(false);
      }
    };

    loadProduct();
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        subcategory: formData.subcategory,
        imageUrl: formData.imageUrl,
      };

      if (isEditMode) {
        await productAPI.updateProduct(id, productData);
        toast.success('Product updated successfully!');
      } else {
        await productAPI.addProduct(productData);
        toast.success('Product added successfully!');
      }

      navigate('/seller/my-products');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (isEditMode ? 'Failed to update product' : 'Failed to add product')
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProduct) {
    return <div className="container mt-4">Loading product...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">{isEditMode ? 'Edit Product' : 'Add New Product'}</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter product name"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description *
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="price" className="form-label">
                      Price *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="subcategory" className="form-label">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="subcategory"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      placeholder="Enter subcategory"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="category" className="form-label">
                      Category *
                    </label>
                    <select
                      className="form-select"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Books">Books</option>
                      <option value="Home & Garden">Home & Garden</option>
                      <option value="Sports">Sports</option>
                      <option value="Toys">Toys</option>
                      <option value="Food">Food</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="imageUrl" className="form-label">
                      Image URL
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {formData.imageUrl && (
                  <div className="mb-3">
                    <label className="form-label">Image Preview:</label>
                    <div>
                      <img
                        src={formData.imageUrl}
                        alt="Product Preview"
                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200?text=Invalid+Image';
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {isEditMode ? 'Updating Product...' : 'Adding Product...'}
                      </>
                    ) : (
                      isEditMode ? 'Update Product' : 'Add Product'
                    )}
                  </button>
                  <Link to="/seller/my-products" className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
