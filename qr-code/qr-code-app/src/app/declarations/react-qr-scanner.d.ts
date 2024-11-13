declare module 'react-qr-scanner' {
    import { FC } from 'react';

    interface QrReaderProps {
        delay?: number;
        onError?: (error: any) => void;
        onScan?: (data: string | null) => void;
        style?: React.CSSProperties;
        facingMode?: 'user' | 'environment';
    }

    const QrReader: FC<QrReaderProps>;
    export default QrReader;
}
