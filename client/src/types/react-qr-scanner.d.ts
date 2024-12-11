declare module 'react-qr-scanner' {
    import { Component } from 'react';
    
    interface QrScannerProps {
        delay?: number;
        style?: object;
        onError?: (error: Error) => void;
        onScan?: (data: string | null) => void;
    }
    
    export default class QrScanner extends Component<QrScannerProps> {}
} 