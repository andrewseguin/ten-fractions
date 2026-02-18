import React from 'react';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-white rounded-3xl shadow-xl border-4 border-slate-100 p-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
