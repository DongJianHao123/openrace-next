
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
    text?: string;
    fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ text = '加载中...', fullScreen = false }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                <p className="text-slate-600 font-medium">{text}</p>
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center justify-center py-12">
             <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
             <p className="text-slate-500 text-sm">{text}</p>
        </div>
    );
};
