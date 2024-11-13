import React, { useState } from 'react';
import QrReader from 'react-qr-scanner';

export const NameInput: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [isScanning, setIsScanning] = useState<boolean>(false);

    const handleSaveName = () => {
        if (name) {
            localStorage.setItem('employeeName', name);
            alert('Имя сохранено в localStorage');
            setIsScanning(true);
        }
    };

    const handleScan = (data: string | null) => {
        if (data) {
            const employeeName = localStorage.getItem('employeeName');
            if (employeeName) {
                fetch('http://localhost:3000/scan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        employeeName,
                        qrCode: data,
                    }),
                })
                    .then(response => {
                        if (response.ok) {
                            alert('Сканирование выполнено, данные отправлены');
                            setIsScanning(false);
                        } else {
                            alert('Ошибка при отправке данных');
                        }
                    })
                    .catch(() => {
                        alert('Ошибка соединения с сервером');
                    });
            }
        }
    };

    const handleError = (error: any) => {
        console.error('Ошибка сканирования:', error);
        alert('Ошибка при доступе к камере');
        setIsScanning(false);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {!isScanning ? (
                <>
                    <input
                        type="text"
                        className="p-2 border border-gray-300 rounded"
                        placeholder="Введите ваше имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button
                        className="mt-4 p-2 bg-blue-500 text-white rounded"
                        onClick={handleSaveName}
                    >
                        Сохранить имя
                    </button>
                </>
            ) : (
                <div className="w-full h-full">
                    <QrReader
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        style={{ width: '100%' }}
                        facingMode="user"
                    />
                    <p className="mt-4">Сканируйте QR-код</p>
                </div>
            )}
        </div>
    );
};
