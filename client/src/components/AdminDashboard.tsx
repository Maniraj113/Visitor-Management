import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
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

const AdminDashboard: React.FC = () => {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchVisitors();
    }, []);

    const fetchVisitors = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/admin/visitors`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.status === 200) {
                setVisitors(response.data);
            } else {
                throw new Error('Failed to fetch visitors');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error fetching visitors', {
                position: "top-right",
                autoClose: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/admin/export`,
                {
                    responseType: 'blob',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.status === 200) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `visitors_${new Date().toISOString().split('T')[0]}.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                toast.success('Export successful!', {
                    position: "top-right",
                    autoClose: 3000
                });
            } else {
                throw new Error('Export failed');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error exporting data', {
                position: "top-right",
                autoClose: 3000
            });
        }
    };

    const filteredVisitors = visitors.filter(visitor =>
        visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.mobile.includes(searchTerm)
    );

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Visitor Management</h2>
                <button 
                    onClick={handleExport}
                    className="btn btn-success"
                >
                    Export to Excel
                </button>
            </div>

            <input
                type="text"
                className="form-control mb-4"
                placeholder="Search visitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Purpose</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center">Loading...</td>
                            </tr>
                        ) : filteredVisitors.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center">No visitors found</td>
                            </tr>
                        ) : (
                            filteredVisitors.map((visitor) => (
                                <tr key={visitor.id}>
                                    <td>{visitor.name}</td>
                                    <td>{visitor.mobile}</td>
                                    <td>{visitor.purpose}</td>
                                    <td>{visitor.check_in || '-'}</td>
                                    <td>{visitor.check_out || '-'}</td>
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
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard; 