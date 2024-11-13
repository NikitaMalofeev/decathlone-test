import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

export const NameInput: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const webcamRef = useRef<Webcam>(null);

    const handleSaveName = () => {
        if (name) {
            localStorage.setItem('employeeName', name);
            alert('Имя сохранено в localStorage');
            setIsScanning(true);
        }
    };

    const captureImage = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                handleScan(imageSrc);
            }
        }
    }, [webcamRef]);

    const handleScan = (data: string | null) => {
        if (data) {
            const employeeName = localStorage.getItem('employeeName');
            if (employeeName) {
                // fetch('https://vast-river-40196-2d5c15ab6cd6.herokuapp.com/scan', {
                fetch('localhost:3000/scan', {
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
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: 'environment' }}
                        style={{ width: '100%' }}
                    />
                    <button
                        className="mt-4 p-2 bg-green-500 text-white rounded"
                        onClick={captureImage}
                    >
                        Включить камеру
                    </button>
                    <p className="mt-4">Сканируйте QR-код</p>
                </div>
            )}
        </div>
    );
};
