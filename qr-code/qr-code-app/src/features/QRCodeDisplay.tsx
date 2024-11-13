import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useQRCodeManager } from '../shared/hooks/useQRCodeManager';
import { useFormattedTime } from '../shared/hooks/useFormattedTime';

export const QRCodeDisplay: React.FC = () => {
    const { qrData, setQrData, generateQRData, isQRCodeExpired, saveQRDataToLocalStorage } = useQRCodeManager();
    const [lastScan, setLastScan] = useState<string | null>(null);

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
                    const formattedTime = useFormattedTime(data.scanTime);
                    setLastScan(`Сотрудник: ${data.employeeName}, Время сканирования: ${formattedTime}`);
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
    }, [generateQRData, isQRCodeExpired, saveQRDataToLocalStorage, setQrData]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 shadow-lg rounded-md flex items-center justify-center">
                <QRCodeCanvas value={qrData} size={256} />
            </div>
            <p className="mt-6 text-lg text-gray-700 text-center">
                {lastScan ? `Последнее сканирование: ${lastScan}` : 'Ожидание сканирования...'}
            </p>
        </div>
    );
};
