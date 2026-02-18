import React, { useState } from 'react';
import { CHARACTERS } from '@/lib/constants';
import Image from 'next/image';

interface CharacterProps {
    id: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    isClimbing?: boolean;
}

export const Character: React.FC<CharacterProps> = ({ id, className = '', size = 'md', isClimbing = false }) => {
    const char = CHARACTERS.find(c => c.id === id) || CHARACTERS[0];
    const [imgError, setImgError] = useState(false);

    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-24 h-24',
        lg: 'w-48 h-48'
    };

    // Fallback content if image missing
    const fallbackIcon = char.type === 'robot' ? '🤖' : '🦖';

    return (
        <div className={`relative rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden ${char.color} ${sizeClasses[size]} ${isClimbing ? 'animate-climb' : ''} ${className}`}>
            {char.image && !imgError ? (
                <Image
                    src={char.image}
                    alt={char.name}
                    fill
                    className="object-cover"
                    onError={() => setImgError(true)}
                />
            ) : (
                <span className="text-white font-bold text-2xl flex items-center justify-center">
                    {fallbackIcon}
                </span>
            )}

            <style jsx>{`
                @keyframes climb-tilt {
                    0%, 100% { transform: rotate(-5deg) translateY(0); }
                    50% { transform: rotate(5deg) translateY(-8px); }
                }
                .animate-climb {
                    animation: climb-tilt 0.6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};
