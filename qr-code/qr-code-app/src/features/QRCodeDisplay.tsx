import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export const QRCodeDisplay: React.FC = () => {
    const [qrData, setQrData] = useState<string>(generateQRData());
    const [lastScan, setLastScan] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setQrData(generateQRData());
        }, 600000);

        const socket = new WebSocket('wss://vast-river-40196-2d5c15ab6cd6.herokuapp.com');
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

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <QRCodeCanvas value={qrData} size={256} />
            <p className="mt-4">{lastScan ? `Последнее сканирование: ${lastScan}` : 'Ожидание сканирования...'}</p>
        </div>
    );
};

function generateQRData() {
    return `qr-code-${Date.now()}`;
}
