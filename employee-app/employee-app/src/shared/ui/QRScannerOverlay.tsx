import React from 'react';

export const QRScannerOverlay: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 1, }}>
            <div className="relative w-80 h-80" style={{ zIndex: 2 }}>
                <div
                    className="absolute inset-0"
                    style={{
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 12%, 12% 12%, 12% 88%, 88% 88%, 88% 12%, 0 12%)',

                    }}
                ></div>
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500"></div>

                <div
                    className="absolute inset-12 bg-transparent"
                    style={{
                        zIndex: 2,
                    }}
                >
                </div>
            </div>
        </div>


    );
};
