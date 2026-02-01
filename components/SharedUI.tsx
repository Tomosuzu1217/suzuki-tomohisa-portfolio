import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

// Reusable Card Component
export const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-[#1a1a1a]/80 backdrop-blur-sm border border-white/10 ${className}`}>
        {children}
    </div>
);

// Loading Spinner
export const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin text-[#C5A265]" size={32} />
    </div>
);

// Error Banner
export const ErrorBanner: React.FC<{ message: string }> = ({ message }) => (
    <div className="mb-4 p-3 bg-red-900/20 border border-red-900 text-red-400 text-sm flex items-center gap-2">
        <AlertCircle size={16} />
        {message}
    </div>
);
