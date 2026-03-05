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
    const [isGameOver, setIsGameOver] = useState(false);

    const gameRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(undefined);
    const lastSpawnRef = useRef<number>(0);
    const playerXRef = useRef(50);
    const isGameOverRef = useRef(false);

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
            if (isGameOverRef.current) {
                requestRef.current = requestAnimationFrame(update);
                return;
            }
            // Spawn treats (2 items every 3 seconds)
            if (time - lastSpawnRef.current > 3000) {
                const newTreats = Array.from({ length: 2 }).map(() => ({
                    id: Math.random(),
                    x: Math.random() * 90 + 5,
                    y: -10,
                    value: 5,
                    speed: 0.2 + Math.random() * 0.3
                }));
                setCoins(prev => [...prev, ...newTreats]);
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
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isGameOverRef.current) return;
            if (e.key === 'ArrowLeft') {
                setPlayerX(prev => {
                    const next = Math.max(5, prev - 5);
                    playerXRef.current = next;
                    return next;
                });
            } else if (e.key === 'ArrowRight') {
                setPlayerX(prev => {
                    const next = Math.min(95, prev + 5);
                    playerXRef.current = next;
                    return next;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isGameOver) {
            isGameOverRef.current = true;
            return;
        }
        isGameOverRef.current = false;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsGameOver(true);
                    isGameOverRef.current = true;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isGameOver]);

    const handlePlayAgain = () => {
        setScore(0);
        setTimeLeft(15);
        setCoins([]);
        setIsGameOver(false);
        isGameOverRef.current = false;
        lastSpawnRef.current = 0;
    };
    return (
        <div
            ref={gameRef}
            className={`relative w-full h-[500px] bg-gradient-to-b from-indigo-400 via-purple-300 to-pink-200 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white animate-in zoom-in duration-500 ${isGameOver ? 'cursor-default' : 'cursor-none'}`}
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

            {/* Coins / Treats */}
            {coins.map(coin => (
                <div
                    key={coin.id}
                    className="absolute text-4xl transition-transform"
                    style={{
                        left: `${coin.x}%`,
                        top: `${coin.y}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <div className="animate-bounce drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                        {coin.value > 5 ? '🍭' : ['🍕', '🍩', '🍰', '🍪', '🍨'][Math.floor(coin.id * 5) % 5]}
                    </div>
                </div>
            ))}

            <div
                className="absolute bottom-10 transition-all duration-75"
                style={{
                    left: `${playerX}%`,
                    transform: 'translateX(-50%)'
                }}
            >
                <div className="relative group">
                    <Character id={characterId} fullBody size="md" className="drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-110" />
                    {/* Catch area indicator */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 rounded-full blur-xl animate-pulse" />
                </div>
            </div>

            {/* Vibrant Game Over Slide */}
            {isGameOver && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white rounded-[3rem] pt-12 pb-6 px-10 text-center max-w-sm w-full mx-4 border-8 border-yellow-400 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 relative">
                        {/* Colorful background confetti elements */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-400" />

                        <div className="mb-4">
                            <p className="text-5xl mb-2 animate-bounce">🏁</p>
                            <h2 className="text-3xl font-black text-indigo-600 mb-0.5 tracking-tighter uppercase leading-none">GREAT JOB!</h2>
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Game Complete!</p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 mb-4 border-4 border-slate-100 shadow-inner">
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-0.5">Final Score</p>
                            <p className="text-4xl font-black text-indigo-800">+{score} PTS</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={handlePlayAgain}
                                className="w-full py-4 text-xl bg-emerald-500 hover:bg-emerald-400 border-b-6 border-emerald-700 active:border-b-0 active:translate-y-2 rounded-2xl shadow-lg transition-all"
                            >
                                🔄 PLAY AGAIN!
                            </Button>
                            <Button
                                onClick={() => onComplete(score)}
                                variant="secondary"
                                className="w-full py-4 text-xl border-b-6 border-slate-300 active:border-b-0 active:translate-y-2 rounded-2xl transition-all flex items-center justify-center gap-2"
                            >
                                🏠 QUIT GAME
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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
