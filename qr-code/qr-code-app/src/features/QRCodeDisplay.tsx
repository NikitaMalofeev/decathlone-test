import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useQRCodeManager } from '../shared/hooks/useQRCodeManager';
import { useFormatTime } from '../shared/hooks/useFormattedTime';

export const QRCodeDisplay: React.FC = () => {
    const { qrData, setQrData, generateQRData, isQRCodeExpired, saveQRDataToLocalStorage } = useQRCodeManager();
    const [lastScan, setLastScan] = useState<string | null>(null);
    const { formatTime } = useFormatTime()

    useEffect(() => {
        const interval = setInterval(() => {
            if (isQRCodeExpired()) {
                const newQRData = generateQRData();
                setQrData(newQRData);
                saveQRDataToLocalStorage(newQRData);
            }
        }, 10000);

        const socket = new WebSocket('wss://vast-river-40196-2d5c15ab6cd6.herokuapp.com');
        socket.onopen = () => {
            console.log('WebSocket соединение открыто');
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'scan') {
                    const formattedTime = formatTime(data.scanTime);
                    setLastScan(`Сотрудник ${data.employeeName} Время сканирования: ${formattedTime}`);
                    const newQRData = generateQRData();
                    setQrData(newQRData);
                    saveQRDataToLocalStorage(newQRData);
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
    }, [generateQRData, isQRCodeExpired, saveQRDataToLocalStorage, setQrData, formatTime]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100" style={{ height: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{ margin: 'auto 0', height: '400px', display: 'flex', flexDirection: 'column', gap: 25 }}>
                <QRCodeCanvas value={qrData} size={256} className="mx-auto" style={{ margin: '0 auto' }} />
                <p className="mt-20 text-lg text-gray-700 text-center">
                    {lastScan ? `Последнее сканирование: ${lastScan}` : 'Ожидание сканирования...'}
                </p>
            </div>
        </div>


    );
};
