import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from "../shared/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogFooter
} from "../shared/components/ui/dialog";
import { Button } from '../shared/components/ui/button';
import { QRScannerOverlay } from '../shared/ui/QRScannerOverlay';

export const NameInput: React.FC = () => {
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [dialogMessage, setDialogMessage] = useState<string>('');
    const webcamRef = useRef<Webcam>(null);

    const formik = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Поле имя обязательно для заполнения')
                .min(2, 'Имя должно содержать не менее 2 символов'),
        }),
        onSubmit: (values) => {
            localStorage.setItem('employeeName', values.name);
            setDialogMessage('Имя сохранено в localStorage');
            setDialogOpen(true);
            setIsScanning(true);
        },
    });

    useEffect(() => {
        if (isScanning && webcamRef.current) {
            const interval = setInterval(() => {
                const imageSrc = webcamRef.current?.getCanvas();
                if (imageSrc) {
                    const context = imageSrc.getContext('2d');
                    if (context) {
                        const imageData = context.getImageData(0, 0, imageSrc.width, imageSrc.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height);
                        if (code) {
                            handleScan(code.data);
                            clearInterval(interval);
                        }
                    }
                }
            }, 500);

            return () => clearInterval(interval);
        }
    }, [isScanning]);

    const handleScan = (data: string | null) => {
        if (data) {
            const employeeName = localStorage.getItem('employeeName');
            if (employeeName) {
                fetch('https://vast-river-40196-2d5c15ab6cd6.herokuapp.com/scan', {
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
                            setDialogMessage('Сканирование выполнено, данные отправлены');
                        } else {
                            setDialogMessage('Ошибка при отправке данных');
                        }
                        setDialogOpen(true);
                        setIsScanning(false);
                    })
                    .catch(() => {
                        setDialogMessage('Ошибка соединения с сервером');
                        setDialogOpen(true);
                    });
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogTitle>Уведомление</DialogTitle>
                    <DialogDescription>{dialogMessage}</DialogDescription>
                    <DialogFooter>
                        <Button onClick={() => setDialogOpen(false)}>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <h1 className="text-3xl text-[#3643ba] mb-6 text-center">Добро пожаловать</h1>
            {!isScanning ? (
                <form onSubmit={formik.handleSubmit} className="flex flex-col items-center">
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Введите ваше имя"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mb-4 w-[300px] ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''}`}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <div className="text-red-500 text-sm mb-2">{formik.errors.name}</div>
                    ) : null}
                    <Button type="submit" variant='outline' className='w-[350px] h-[60px] bg-[#00000000] text-2x1 border border-gray-500 rounded-[29px] text-[#3643ba]'>
                        Далее
                    </Button>
                </form>
            ) : (
                <div className="relative w-full h-full">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: 'environment' }}
                        style={{ width: '100%', height: '100%' }}
                    />
                    <QRScannerOverlay />
                </div>
            )}
        </div>
    );
};
