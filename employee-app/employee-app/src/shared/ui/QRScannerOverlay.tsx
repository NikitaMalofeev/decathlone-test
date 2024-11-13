import React from 'react';

export const QRScannerOverlay: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="relative w-80 h-80">
                <div
                    className="absolute inset-0 bg-black bg-opacity-70"
                    style={{
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 25%, 25% 25%, 25% 75%, 75% 75%, 75% 25%, 0 25%)',
                    }}
                ></div>
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500"></div>
            </div>
        </div>
    );
};
