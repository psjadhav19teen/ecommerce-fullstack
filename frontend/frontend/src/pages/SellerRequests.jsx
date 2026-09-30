import React, { useState, useEffect } from 'react';
import { sellerRequestAPI } from '../services/api';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const SellerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await sellerRequestAPI.getAllRequests();
      setRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch seller requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await sellerRequestAPI.approveSeller(id);
      toast.success('Seller approved successfully!');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve seller');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await sellerRequestAPI.rejectSeller(id);
      toast.success('Seller request rejected!');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject seller');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <Loading message="Loading seller requests..." />;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Seller Requests</h2>
      
      {requests.length === 0 ? (
        <div className="alert alert-info">
          No pending seller requests at the moment.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.name}</td>
                  <td>{request.email}</td>
                  <td>{request.phone}</td>
                  <td>
                    <span className={`badge ${
                      request.sellerStatus === 'REQUESTED' ? 'bg-warning' :
                      request.sellerStatus === 'APPROVED' ? 'bg-success' :
                      'bg-danger'
                    }`}>
                      {request.sellerStatus}
                    </span>
                  </td>
                  <td>
                    {request.sellerStatus === 'REQUESTED' && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleApprove(request.id)}
                          disabled={actionLoading === request.id}
                        >
                          {actionLoading === request.id ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : (
                            'Approve'
                          )}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleReject(request.id)}
                          disabled={actionLoading === request.id}
                        >
                          {actionLoading === request.id ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : (
                            'Reject'
                          )}
                        </button>
                      </div>
                    )}
                    {request.sellerStatus === 'APPROVED' && (
                      <span className="text-success">✓ Approved</span>
                    )}
                    {request.sellerStatus === 'REJECTED' && (
                      <span className="text-danger">✗ Rejected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerRequests;
