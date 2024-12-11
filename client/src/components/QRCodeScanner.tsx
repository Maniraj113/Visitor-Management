import React from 'react';
import QrScanner from 'react-qr-scanner';

interface QRCodeScannerProps {
    onScan: (data: string | null) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan }) => {
    return (
        <div className="qr-scanner-container">
            <QrScanner
                delay={300}
                onError={(error) => console.error(error)}
                onScan={onScan}
                style={{ width: '100%' }}
            />
            <div className="scanner-overlay" />
            <p className="text-center mt-2">
                Position the QR code within the frame
            </p>
        </div>
    );
};

export default QRCodeScanner; 