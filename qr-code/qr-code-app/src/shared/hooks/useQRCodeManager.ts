// src/hooks/useQRCodeManager.ts
import { useState } from 'react';

export const useQRCodeManager = () => {
    const [qrData, setQrData] = useState<string>(() => getInitialQRData());

    function generateQRData() {
        const qrData = `qr-code-${Date.now()}`;
        localStorage.setItem('qrGeneratedTime', Date.now().toString());
        return qrData;
    }

    function getInitialQRData() {
        const storedTime = localStorage.getItem('qrGeneratedTime');
        const currentTime = Date.now();

        if (storedTime && currentTime - parseInt(storedTime, 10) < 600000) { // 10 минут = 600000 мс
            return `qr-code-${storedTime}`;
        } else {
            const newQRData = generateQRData();
            saveQRDataToLocalStorage(newQRData);
            return newQRData;
        }
    }

    function isQRCodeExpired() {
        const storedTime = localStorage.getItem('qrGeneratedTime');
        if (storedTime) {
            const currentTime = Date.now();
            return currentTime - parseInt(storedTime, 10) >= 600000; // 10 минут
        }
        return true;
    }

    function saveQRDataToLocalStorage(qrData: string) {
        localStorage.setItem('qrGeneratedTime', Date.now().toString());
        localStorage.setItem('qrData', qrData);
    }

    return { qrData, setQrData, generateQRData, isQRCodeExpired, saveQRDataToLocalStorage };
};
