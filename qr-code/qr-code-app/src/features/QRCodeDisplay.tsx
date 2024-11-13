import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import QrReader from 'react-qr-scanner';

export const QRCodeDisplay: React.FC = () => {
    const [qrData, setQrData] = useState<string>(generateQRData());
    const [lastScan, setLastScan] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setQrData(generateQRData());
        }, 600000);

        const socket = new WebSocket('ws://localhost:3000');
        socket.onopen = () => {
            console.log('WebSocket соединение открыто');
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'scan') {
                    setLastScan(`Сотрудник: ${data.employeeName}, Время сканирования: ${data.scanTime}`);
                    setQrData(generateQRData());
                }
            } catch (error) {
                console.error('Ошибка при обработке данных WebSocket:', error);
            }
        };

        socket.onerror = (error) => {
            console.error('Ошибка WebSocket:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket соединение закрыто');
        };

        return () => {
            clearInterval(interval);
            socket.close();
        };
    }, []);

    const handleScan = (data: string | null) => {
        if (data) {
            console.log('QR-код отсканирован:', data);
            setQrData(generateQRData()); 
            setLastScan(`Отсканировано: ${data}`);
        }
    };

    const handleError = (error: any) => {
        console.error('Ошибка при сканировании:', error);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <QRCodeCanvas value={qrData} size={256} />
            <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
            />
            <p className="mt-4">{lastScan ? `Последнее сканирование: ${lastScan}` : 'Ожидание сканирования...'}</p>
        </div>
    );
};

function generateQRData() {
    return `qr-code-${Date.now()}`;
}
