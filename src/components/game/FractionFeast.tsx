'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Character } from './Character';
import { Button } from '@/components/ui/Button';

interface FractionFeastProps {
    characterId: string;
    onComplete: (points: number) => void;
}

interface Coin {
    id: number;
    x: number;
    y: number;
    value: number;
    speed: number;
}

export const FractionFeast: React.FC<FractionFeastProps> = ({ characterId, onComplete }) => {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [playerX, setPlayerX] = useState(50); // percentage
    const [coins, setCoins] = useState<Coin[]>([]);

    const gameRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(undefined);
    const lastSpawnRef = useRef<number>(0);
    const playerXRef = useRef(50);

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!gameRef.current) return;
        const rect = gameRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const x = ((clientX - rect.left) / rect.width) * 100;
        const limitedX = Math.max(5, Math.min(95, x));
        setPlayerX(limitedX);
        playerXRef.current = limitedX;
    };

    useEffect(() => {
        const update = (time: number) => {
            // Spawn coins
            if (time - lastSpawnRef.current > 800) {
                setCoins(prev => [
                    ...prev,
                    {
                        id: Math.random(),
                        x: Math.random() * 90 + 5,
                        y: -10,
                        value: 5,
                        speed: 1.5 + Math.random() * 2
                    }
                ]);
                lastSpawnRef.current = time;
            }

            // Move coins
            setCoins(prev => {
                const nextCoins = prev.map(c => ({ ...c, y: c.y + c.speed }));

                // Collision check
                const caught = nextCoins.filter(c =>
                    c.y > 75 && c.y < 85 && Math.abs(c.x - playerXRef.current) < 10
                );

                if (caught.length > 0) {
                    setScore(s => s + caught.length * 5);
                }

                return nextCoins.filter(c => c.y < 100 && !caught.includes(c));
            });

            requestRef.current = requestAnimationFrame(update);
        };

        requestRef.current = requestAnimationFrame(update);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onComplete(score);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [score, onComplete]);

    return (
        <div
            ref={gameRef}
            className="relative w-full h-[500px] bg-gradient-to-b from-sky-300 to-sky-100 rounded-[3rem] overflow-hidden cursor-none shadow-2xl border-8 border-white animate-in zoom-in duration-500"
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
        >
            {/* HUD */}
            <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10">
                <div className="bg-white/80 backdrop-blur-md px-6 py-2 rounded-2xl shadow-lg border-2 border-sky-200">
                    <p className="text-sky-500 font-black text-[10px] uppercase tracking-widest leading-none mb-1">Score</p>
                    <p className="text-sky-800 font-black text-2xl leading-none">+{score} PTS</p>
                </div>
                <div className="bg-white/80 backdrop-blur-md px-6 py-2 rounded-2xl shadow-lg border-2 border-rose-200">
                    <p className="text-rose-500 font-black text-[10px] uppercase tracking-widest leading-none mb-1">Time</p>
                    <p className="text-rose-800 font-black text-2xl leading-none">{timeLeft}S</p>
                </div>
            </div>

            {/* Instruction Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
                <p className="text-8xl font-black text-white uppercase tracking-tighter text-center leading-[0.8]">
                    CATCH THE<br />FRACTIONS!
                </p>
            </div>

            {/* Clouds Background */}
            <div className="absolute top-20 left-[10%] text-6xl opacity-30 animate-float">☁️</div>
            <div className="absolute top-40 right-[15%] text-7xl opacity-40 animate-float-delayed">☁️</div>

            {/* Coins */}
            {coins.map(coin => (
                <div
                    key={coin.id}
                    className="absolute text-3xl transition-transform"
                    style={{
                        left: `${coin.x}%`,
                        top: `${coin.y}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <div className="animate-bounce">🍕</div>
                </div>
            ))}

            {/* Player */}
            <div
                className="absolute bottom-10 transition-all duration-75"
                style={{
                    left: `${playerX}%`,
                    transform: 'translateX(-50%)'
                }}
            >
                <div className="relative">
                    <Character id={characterId} fullBody size="md" className="drop-shadow-2xl" />
                    {/* Catch area indicator (debug or subtle flare) */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-white/30 rounded-full blur-md" />
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-20px) translateX(10px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float 8s ease-in-out infinite 1s;
                }
            `}</style>
        </div>
    );
};
