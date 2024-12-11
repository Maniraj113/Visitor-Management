import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface VisitorData {
    name: string;
    mobile: string;
    govt_id: string;
    purpose: string;
}

const VisitorForm: React.FC = () => {
    const [formData, setFormData] = useState<VisitorData>({
        name: '',
        mobile: '',
        govt_id: '',
        purpose: ''
    });
    const [loading, setLoading] = useState(false);
    const [qrCode, setQrCode] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/visitors/register`,
                formData
            );
            setQrCode(response.data.qr_code);
            alert('Registration successful!');
            setFormData({ name: '', mobile: '', govt_id: '', purpose: '' });
        } catch (error) {
            alert('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadQR = () => {
        if (qrCode) {
            const link = document.createElement('a');
            link.href = qrCode;
            link.download = `visitor-qr-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <h2 className="text-center mb-4">Visitor Registration</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="mobile" className="form-label">Mobile Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="mobile"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                pattern="[0-9]{10}"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="govt_id" className="form-label">Government ID</label>
                            <input
                                type="text"
                                className="form-control"
                                id="govt_id"
                                value={formData.govt_id}
                                onChange={(e) => setFormData({ ...formData, govt_id: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="purpose" className="form-label">Purpose of Visit</label>
                            <textarea
                                className="form-control"
                                id="purpose"
                                value={formData.purpose}
                                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                required
                                rows={3}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>

                    {qrCode && (
                        <div className="mt-4 text-center">
                            <h3>Your QR Code</h3>
                            <img 
                                src={qrCode} 
                                alt="QR Code" 
                                className="img-fluid mb-3"
                                style={{ maxWidth: '200px' }} 
                            />
                            <div>
                                <button 
                                    onClick={handleDownloadQR}
                                    className="btn btn-success"
                                >
                                    Download QR Code
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisitorForm; 