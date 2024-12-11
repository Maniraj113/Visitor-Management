import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QrScanner from 'react-qr-scanner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Visitor {
    id: string;
    name: string;
    mobile: string;
    purpose: string;
    check_in?: string;
    check_out?: string;
}

const SecurityDashboard: React.FC = () => {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchVisitors();
        const interval = setInterval(fetchVisitors, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchVisitors = async () => {
        try {
            const response = await axios.get<Visitor[]>(
                `${process.env.REACT_APP_API_URL}/api/security/visitors`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setVisitors(response.data);
        } catch (error) {
            toast.error('Failed to fetch visitors data', {
                position: "top-right",
                autoClose: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleScan = async (data: string | null) => {
        if (data && !processing) {
            setProcessing(true);
            try {
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/security/check-in`,
                    { qr_code: data },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                toast.success('Visitor checked in successfully!', {
                    position: "top-right",
                    autoClose: 3000
                });
                await fetchVisitors();
                setShowScanner(false);
            } catch (error) {
                toast.error('Failed to process QR code. Please try again.', {
                    position: "top-right",
                    autoClose: 3000
                });
            } finally {
                setProcessing(false);
            }
        }
    };

    const handleCheckIn = async (visitorId: string) => {
        if (processing) return;
        setProcessing(true);
        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/security/check-in`,
                { visitor_id: visitorId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            toast.success('Visitor checked in successfully!', {
                position: "top-right",
                autoClose: 3000
            });
            await fetchVisitors();
        } catch (error) {
            toast.error('Failed to check in visitor. Please try again.', {
                position: "top-right",
                autoClose: 3000
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleCheckOut = async (visitorId: string) => {
        if (processing) return;
        setProcessing(true);
        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/security/check-out`,
                { visitor_id: visitorId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            toast.success('Visitor checked out successfully!', {
                position: "top-right",
                autoClose: 3000
            });
            await fetchVisitors();
        } catch (error) {
            toast.error('Failed to check out visitor. Please try again.', {
                position: "top-right",
                autoClose: 3000
            });
        } finally {
            setProcessing(false);
        }
    };

    const filteredVisitors = visitors.filter(visitor =>
        visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.mobile.includes(searchTerm)
    );

    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Security Dashboard</h2>
                <button 
                    onClick={() => setShowScanner(!showScanner)}
                    className={`btn ${showScanner ? 'btn-danger' : 'btn-primary'}`}
                    disabled={processing}
                >
                    {showScanner ? 'Close Scanner' : 'Open QR Scanner'}
                </button>
            </div>

            {showScanner && (
                <div className="mb-4">
                    <div className="qr-scanner-wrapper" style={{ maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
                        <QrScanner
                            delay={300}
                            onError={(error) => {
                                console.error(error);
                                toast.error('Camera error. Please check permissions.');
                            }}
                            onScan={handleScan}
                            style={{ width: '100%' }}
                        />
                        <div className="scanner-overlay" style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            border: '2px solid #0d6efd',
                            borderRadius: '8px',
                            pointerEvents: 'none'
                        }} />
                    </div>
                    <p className="text-center mt-2 text-muted">
                        Position the QR code within the frame to scan
                    </p>
                </div>
            )}

            <div className="card mb-4">
                <div className="card-body">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search visitors by name or mobile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Purpose</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredVisitors.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center text-muted">
                                    No visitors found
                                </td>
                            </tr>
                        ) : (
                            filteredVisitors.map((visitor) => (
                                <tr key={visitor.id}>
                                    <td>{visitor.name}</td>
                                    <td>{visitor.mobile}</td>
                                    <td>{visitor.purpose}</td>
                                    <td>
                                        <span className={`badge ${
                                            visitor.check_out ? 'bg-secondary' : 
                                            visitor.check_in ? 'bg-success' : 
                                            'bg-warning'
                                        }`}>
                                            {visitor.check_out ? 'Checked Out' : 
                                             visitor.check_in ? 'Checked In' : 
                                             'Registered'}
                                        </span>
                                    </td>
                                    <td>
                                        {!visitor.check_out && (
                                            !visitor.check_in ? (
                                                <button
                                                    onClick={() => handleCheckIn(visitor.id)}
                                                    className="btn btn-success btn-sm"
                                                    disabled={processing}
                                                >
                                                    {processing ? 'Processing...' : 'Check In'}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleCheckOut(visitor.id)}
                                                    className="btn btn-danger btn-sm"
                                                    disabled={processing}
                                                >
                                                    {processing ? 'Processing...' : 'Check Out'}
                                                </button>
                                            )
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SecurityDashboard; 