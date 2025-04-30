import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { removeUserLogged } from '../../auth';
import { useNavigate } from 'react-router-dom';
import QRCode from "react-qr-code";

const WithdrawRequests = () => {
    const navigate = useNavigate();
    const [withdrawRequests, setWithdrawRequests] = useState([]);

    const updateWithdrawRequest = async (e) => {
        e.preventDefault();
        const order_id = e.target.order_id.value;
        const status = e.target.status.value;
        const payment_id = e.target.payment_id.value;

        try {
            const response = await fetch('http://localhost:4200/api/admin/updateWithdrawRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                },
                body: JSON.stringify({ order_id, status, payment_id }),
            });

            if (!response.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Please login again!',
                    showConfirmButton: false,
                    timer: 2000,
                });
                setTimeout(() => {
                    removeUserLogged();
                    navigate('/');
                }, 2000);
                return;
            }

            Swal.fire({
                icon: 'success',
                title: 'Request updated successfully!',
                showConfirmButton: false,
                timer: 2000,
            });

            setTimeout(() => {
                navigate(0);
            }, 2000);

        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("Failed to update Withdrawal request.");
        }
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch('http://localhost:4200/api/admin/withdrawRequests', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token'),
                    },
                });

                if (!response.ok) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Please login again!',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    setTimeout(() => {
                        removeUserLogged();
                        navigate('/');
                    }, 2000);
                    return;
                }

                const responseData = await response.json();
                setWithdrawRequests(responseData);
            } catch (err) {
                console.error(err.response?.data || err.message);
                alert("Failed to load Withdrawal requests.");
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <div className='container mt-5'>
            <div className='card'>
                <div className='card-body'>
                    <h2 className="card-title mb-4 text-center">Withdraw Requests</h2>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className='table-dark'>
                                <tr>
                                    <th>#</th>
                                    <th>Order ID</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>UPI ID</th>
                                    <th>User ID</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {withdrawRequests.map((withdrawRequest, index) => (
                                    <tr key={withdrawRequest._id}>
                                        <th>{index + 1}</th>
                                        <td>{withdrawRequest.order_id}</td>
                                        <td>₹{withdrawRequest.amount}</td>
                                        <td className={(withdrawRequest.status === 'Created' || withdrawRequest.status === 'Pending') ? 'text-warning' : (withdrawRequest.status === 'Paid' ? 'text-success' : 'text-danger')}>
                                            {withdrawRequest.status}
                                        </td>
                                        <td>{withdrawRequest.upi_id}</td>
                                        <td>{withdrawRequest.user_id}</td>
                                        <td>{new Date(withdrawRequest.createdAt).toLocaleString()}</td>
                                        <td>
                                            {(withdrawRequest.status === 'Created' || withdrawRequest.status === 'Pending') ? (
                                                <button type="button" className="btn btn-sm btn-info rounded-pill" data-bs-toggle="modal" data-bs-target={`#modal-${withdrawRequest._id}`}>
                                                    Pay Now
                                                </button>
                                            ) : (
                                                <span className="badge bg-success">Completed</span>
                                            )}
                                        </td>

                                        {/* Modal */}
                                        <div className="modal fade" id={`modal-${withdrawRequest._id}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered modal-sm">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="modalLabel">Update Withdrawal</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <form onSubmit={updateWithdrawRequest}>
                                                        <div className="modal-body">
                                                            <div className="text-center mb-3">
                                                                <QRCode
                                                                    className='border border-primary p-2'
                                                                    size={150}
                                                                    value={`upi://pay?pa=${withdrawRequest.upi_id}&am=${withdrawRequest.amount}&tn=${withdrawRequest.order_id}&cu=INR`}
                                                                />
                                                                <p className='mt-2 small'>Scan to Pay</p>
                                                            </div>
                                                            <div className="mb-2">
                                                                <label htmlFor="order_id" className="form-label">Order ID</label>
                                                                <input type="text" id="order_id" name="order_id" className="form-control" value={withdrawRequest.order_id} disabled />
                                                            </div>
                                                            <div className="mb-2">
                                                                <label htmlFor="status" className="form-label">Status</label>
                                                                <select id="status" name="status" className="form-select" defaultValue={withdrawRequest.status}>
                                                                    <option value="Pending">Pending</option>
                                                                    <option value="Failed">Failed</option>
                                                                    <option value="Paid">Paid</option>
                                                                </select>
                                                            </div>
                                                            <div className="mb-2">
                                                                <label htmlFor="payment_id" className="form-label">Payment ID/UTR</label>
                                                                <input type="text" id="payment_id" name="payment_id" className="form-control" required />
                                                            </div>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-danger btn-sm rounded-pill" data-bs-dismiss="modal">Close</button>
                                                            <button type="submit" className="btn btn-primary btn-sm rounded-pill">Update</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WithdrawRequests;
