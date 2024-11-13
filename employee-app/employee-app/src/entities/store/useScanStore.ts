import { create } from 'zustand';

interface ScanStore {
    message: string;
    isScanning: boolean;
    setMessage: (newMessage: string) => void;
    setIsScanning: (scanning: boolean) => void;
}

export const useScanStore = create<ScanStore>((set) => ({
    message: '',
    isScanning: false,
    setMessage: (newMessage) => set({ message: newMessage }),
    setIsScanning: (scanning) => set({ isScanning: scanning }),
}));
