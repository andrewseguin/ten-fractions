import React from 'react';

interface FractionDisplayProps {
    numerator: number;
    denominator: number;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const FractionDisplay: React.FC<FractionDisplayProps> = ({ numerator, denominator, className = '', size = 'md' }) => {
    const sizeClasses = {
        sm: 'text-base',
        md: 'text-2xl',
        lg: 'text-4xl',
        xl: 'text-6xl'
    };

    const lineThickness = {
        sm: 'border-b-2',
        md: 'border-b-2',
        lg: 'border-b-4',
        xl: 'border-b-4 sm:border-b-8'
    };

    return (
        <div className={`inline-flex flex-col items-center justify-center font-black leading-none ${sizeClasses[size]} ${className}`}>
            <span className={`px-2 ${lineThickness[size]} border-current mb-1 block w-full text-center`}>{numerator}</span>
            <span className="block w-full text-center">{denominator}</span>
        </div>
    );
};
