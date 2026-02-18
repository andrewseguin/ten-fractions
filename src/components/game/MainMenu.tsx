'use client';

import React, { useState } from 'react';
import { CHARACTERS, BACKGROUNDS, PlayerType } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Character } from './Character';

interface MainMenuProps {
    onStart: (settings: {
        p1Name: string;
        p1Char: string;
        p2Type: PlayerType;
        p2Name: string;
        p2Char: string;
        difficulty: number;
        bgId: string;
    }) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStart }) => {
    const [p1Name, setP1Name] = useState('Hero');
    const [p1Char, setP1Char] = useState(CHARACTERS[0].id);

    const [mode, setMode] = useState<PlayerType>('computer');
    const [p2Name, setP2Name] = useState('Computer');
    const [p2Char, setP2Char] = useState(CHARACTERS[2].id); // Default to first Dino

    const [difficulty, setDifficulty] = useState(1);
    const [bgId, setBgId] = useState(BACKGROUNDS[0].id);

    const handleStart = () => {
        onStart({
            p1Name,
            p1Char,
            p2Type: mode,
            p2Name: mode === 'computer' ? 'Computer' : p2Name,
            p2Char,
            difficulty,
            bgId
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-300 to-indigo-500 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full border-8 border-yellow-400 shadow-2xl bg-white/95 backdrop-blur-sm">
                <h1 className="text-6xl font-black text-center text-indigo-600 mb-2 tracking-tight drop-shadow-sm">
                    TEN FRACTIONS
                </h1>
                <p className="text-center text-slate-500 font-bold mb-8 text-xl">
                    🤖 Robots vs Dinosaurs 🦖
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Player 1 Settings */}
                    <div className="bg-blue-50 p-6 rounded-3xl border-4 border-blue-200">
                        <h2 className="text-2xl font-black text-blue-600 mb-4 flex items-center gap-2">
                            <span>🤖</span> YOU
                        </h2>
                        <div className="mb-4">
                            <input
                                value={p1Name}
                                onChange={e => setP1Name(e.target.value)}
                                className="w-full p-3 border-4 border-blue-200 rounded-2xl font-bold text-lg text-blue-900 focus:border-blue-500 outline-none transition-colors"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="flex gap-3 flex-wrap justify-center">
                            {CHARACTERS.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setP1Char(c.id)}
                                    className={`relative p-1 rounded-full border-4 transition-all duration-300 hover:scale-110 ${p1Char === c.id ? 'border-blue-500 scale-110 ring-4 ring-blue-200 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                >
                                    <Character id={c.id} size="sm" />
                                    {p1Char === c.id && <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1 text-xs">✔️</div>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Opponent Settings */}
                    <div className="bg-rose-50 p-6 rounded-3xl border-4 border-rose-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-black text-rose-600 flex items-center gap-2">
                                <span>🦖</span> OPPONENT
                            </h2>
                            <div className="flex bg-white rounded-xl p-1 shadow-inner">
                                <button onClick={() => setMode('computer')} className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${mode === 'computer' ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-slate-600'}`}>Bot</button>
                                <button onClick={() => setMode('human')} className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${mode === 'human' ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-slate-600'}`}>Friend</button>
                            </div>
                        </div>

                        {mode === 'human' && (
                            <div className="mb-4">
                                <input
                                    value={p2Name}
                                    onChange={e => setP2Name(e.target.value)}
                                    className="w-full p-3 border-4 border-rose-200 rounded-2xl font-bold text-lg text-rose-900 focus:border-rose-500 outline-none transition-colors"
                                    placeholder="Friend's Name"
                                />
                            </div>
                        )}

                        <div className="flex gap-3 flex-wrap justify-center">
                            {CHARACTERS.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setP2Char(c.id)}
                                    className={`relative p-1 rounded-full border-4 transition-all duration-300 hover:scale-110 ${p2Char === c.id ? 'border-rose-500 scale-110 ring-4 ring-rose-200 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                >
                                    <Character id={c.id} size="sm" />
                                    {p2Char === c.id && <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white rounded-full p-1 text-xs">✔️</div>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Settings Area */}
                <div className="mt-8 bg-slate-50 p-6 rounded-3xl border-4 border-slate-200">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-black text-slate-400 mb-3 tracking-wider text-sm">DIFFICULTY LEVEL</h3>
                            <div className="flex gap-2">
                                {[1, 2, 3].map(d => (
                                    <Button
                                        key={d}
                                        variant={difficulty === d ? 'primary' : 'secondary'}
                                        onClick={() => setDifficulty(d)}
                                        className={`flex-1 ${difficulty === d ? 'ring-4 ring-indigo-200' : ''}`}
                                    >
                                        Level {d}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-black text-slate-400 mb-3 tracking-wider text-sm">BATTLE ARENA</h3>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                                {BACKGROUNDS.map(bg => (
                                    <button
                                        key={bg.id}
                                        onClick={() => setBgId(bg.id)}
                                        className={`h-16 w-24 rounded-2xl shrink-0 border-4 transition-all hover:scale-105 ${bg.css} ${bgId === bg.id ? 'border-indigo-500 shadow-lg scale-105 ring-4 ring-indigo-200' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <Button size="lg" className="w-full text-2xl py-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all bg-gradient-to-r from-indigo-600 to-violet-600 border-b-8 border-indigo-800" onClick={handleStart}>
                        START GAME 🚀
                    </Button>
                </div>
            </Card>
        </div>
    );
};
