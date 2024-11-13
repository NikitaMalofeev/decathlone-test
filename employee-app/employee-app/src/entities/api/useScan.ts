// src/hooks/useScan.ts
import { useScanStore } from '../store/useScanStore';

export const useScan = () => {
    const setMessage = useScanStore((state) => state.setMessage);
    const setIsScanning = useScanStore((state) => state.setIsScanning);

    const handleScan = async (data: string | null) => {
        if (data) {
            const employeeName = localStorage.getItem('employeeName');
            if (employeeName) {
                try {
                    const response = await fetch('https://vast-river-40196-2d5c15ab6cd6.herokuapp.com/scan', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            employeeName,
                            qrCode: data,
                        }),
                    });

                    if (response.ok) {
                        setMessage('Сканирование выполнено, данные отправлены');
                        console.log('Сканирование выполнено, данные отправлены')
                    } else {
                        setMessage('Ошибка при отправке данных');
                    }
                    setIsScanning(false);
                } catch (error) {
                    console.error('Ошибка соединения с сервером', error);
                    setMessage('Ошибка соединения с сервером');
                    setIsScanning(false);
                }
            }
        }
    };

    return { handleScan };
};
