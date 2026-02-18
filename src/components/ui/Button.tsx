import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    const baseStyles = 'font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        primary: 'bg-indigo-600 text-white shadow-[0_4px_0_rgb(67,56,202)] hover:bg-indigo-500 hover:shadow-[0_4px_0_rgb(79,70,229)] active:shadow-none active:translate-y-1',
        secondary: 'bg-white text-indigo-600 border-2 border-indigo-200 shadow-[0_4px_0_rgb(224,231,255)] hover:bg-slate-50 active:shadow-none active:translate-y-1',
        danger: 'bg-rose-500 text-white shadow-[0_4px_0_rgb(190,18,60)] hover:bg-rose-400 active:shadow-none active:translate-y-1',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100'
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-xl'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
