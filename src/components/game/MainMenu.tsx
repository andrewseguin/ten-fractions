'use client';

import React, { useState } from 'react';
import { CHARACTERS, BACKGROUNDS, PlayerType } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Character } from './Character';
import Image from 'next/image';

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
    const [p2Char, setP2Char] = useState(CHARACTERS[2].id);

    const [difficulty, setDifficulty] = useState(1);
    const [bgId, setBgId] = useState('mountain'); // Default to mountain now

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
        <div className="min-h-screen bg-gradient-to-b from-sky-400 to-indigo-600 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full border-8 border-yellow-400 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] bg-white/95 backdrop-blur-md overflow-hidden">
                {/* New Prominent Top Section for Mode */}
                <div className="bg-indigo-700 p-8 text-center relative">
                    <h1 className="text-6xl sm:text-7xl font-black text-white mb-2 tracking-tighter drop-shadow-2xl">
                        TEN FRACTIONS
                    </h1>
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={() => setBgId('mountain')}
                            className={`px-8 py-4 rounded-3xl font-black text-xl transition-all border-b-8 active:border-b-0 active:translate-y-2 ${bgId === 'mountain' ? 'bg-sky-400 text-white border-sky-600 shadow-xl scale-105' : 'bg-white/10 text-white/60 border-transparent hover:bg-white/20'}`}
                        >
                            🧗 MOUNTAIN CLIMB
                            <span className="block text-xs uppercase tracking-widest opacity-80">Progressive Challenge</span>
                        </button>
                        <button
                            onClick={() => setBgId('concert')} // Just pick concert as the "Battle" default
                            className={`px-8 py-4 rounded-3xl font-black text-xl transition-all border-b-8 active:border-b-0 active:translate-y-2 ${bgId !== 'mountain' ? 'bg-indigo-400 text-white border-indigo-600 shadow-xl scale-105' : 'bg-white/10 text-white/60 border-transparent hover:bg-white/20'}`}
                        >
                            ⚔️ CLASSIC BATTLE
                            <span className="block text-xs uppercase tracking-widest opacity-80">Fixed Difficulty</span>
                        </button>
                    </div>

                    {/* Animated clouds in header */}
                    <div className="absolute top-4 left-10 text-4xl animate-pulse opacity-40">☁️</div>
                    <div className="absolute top-10 right-20 text-5xl animate-bounce opacity-30">☁️</div>
                </div>

                <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-8 mb-10">
                        {/* Player 1 Settings */}
                        <div className="bg-blue-50/50 p-6 rounded-[2.5rem] border-4 border-blue-100 shadow-inner">
                            <h2 className="text-2xl font-black text-blue-600 mb-6 flex items-center gap-3">
                                <span className="bg-white p-2 rounded-xl shadow-sm text-lg">🤖</span> CHOOSE HERO
                            </h2>
                            <div className="mb-6">
                                <input
                                    value={p1Name}
                                    onChange={e => setP1Name(e.target.value)}
                                    className="w-full p-4 border-4 border-blue-100 rounded-3xl font-black text-xl text-blue-900 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="flex gap-4 flex-wrap justify-center">
                                {CHARACTERS.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => setP1Char(c.id)}
                                        className={`relative p-1 rounded-full border-4 transition-all duration-300 hover:scale-110 active:scale-95 ${p1Char === c.id ? 'border-blue-500 scale-110 ring-8 ring-blue-50 shadow-2xl' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <Character id={c.id} size="md" className="sm:w-20 sm:h-20" />
                                        {p1Char === c.id && <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm shadow-lg border-2 border-white animate-in zoom-in">⭐</div>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Opponent Settings */}
                        <div className="bg-rose-50/50 p-6 rounded-[2.5rem] border-4 border-rose-100 shadow-inner">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-rose-600 flex items-center gap-3">
                                    <span className="bg-white p-2 rounded-xl shadow-sm text-lg">🦖</span> OPPONENT
                                </h2>
                                <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border-2 border-rose-100">
                                    <button onClick={() => setMode('computer')} className={`px-4 py-2 rounded-xl text-sm font-black transition-all uppercase tracking-tighter ${mode === 'computer' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Bot</button>
                                    <button onClick={() => setMode('human')} className={`px-4 py-2 rounded-xl text-sm font-black transition-all uppercase tracking-tighter ${mode === 'human' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Friend</button>
                                </div>
                            </div>

                            {mode === 'human' ? (
                                <div className="mb-6 animate-in slide-in-from-top-4">
                                    <input
                                        value={p2Name}
                                        onChange={e => setP2Name(e.target.value)}
                                        className="w-full p-4 border-4 border-rose-100 rounded-3xl font-black text-xl text-rose-900 focus:border-rose-400 focus:ring-4 focus:ring-rose-50 outline-none transition-all"
                                        placeholder="Friend's Name"
                                    />
                                </div>
                            ) : (
                                <div className="mb-6 h-[68px] flex items-center justify-center bg-white/50 rounded-3xl border-4 border-dashed border-rose-100">
                                    <p className="text-rose-300 font-black italic tracking-widest">AUTO BOT READY</p>
                                </div>
                            )}

                            <div className="flex gap-4 flex-wrap justify-center">
                                {CHARACTERS.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => setP2Char(c.id)}
                                        className={`relative p-1 rounded-full border-4 transition-all duration-300 hover:scale-110 active:scale-95 ${p2Char === c.id ? 'border-rose-500 scale-110 ring-8 ring-rose-50 shadow-2xl' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <Character id={c.id} size="md" className="sm:w-20 sm:h-20" />
                                        {p2Char === c.id && <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm shadow-lg border-2 border-white animate-in zoom-in">👾</div>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Arena Selection Area (Dynamic based on Mode) */}
                    <div className="bg-slate-50/50 p-6 rounded-[2.5rem] border-4 border-slate-100 shadow-inner">
                        {bgId === 'mountain' ? (
                            <div className="flex flex-col md:flex-row items-center gap-8 animate-in fade-in slide-in-from-top-4">
                                <div className="relative w-full md:w-1/3 aspect-video rounded-3xl overflow-hidden border-8 border-sky-300 shadow-2xl scale-105">
                                    <Image src="/assets/mountain.png" alt="Mountain" fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-3xl font-black text-sky-600 mb-2">🏔️ MOUNTAIN MODE ACTIVE</h3>
                                    <p className="text-slate-500 font-bold leading-relaxed">
                                        In this mode, you climb the peak by getting answers right!
                                        Difficulty increases automatically as you go higher. 📈
                                    </p>
                                    <div className="mt-4 flex gap-4">
                                        <span className="bg-sky-100 text-sky-600 px-4 py-2 rounded-full text-xs font-black uppercase">Level 1: 0-30m</span>
                                        <span className="bg-sky-200 text-sky-700 px-4 py-2 rounded-full text-xs font-black uppercase">Level 2: 30-60m</span>
                                        <span className="bg-sky-300 text-sky-800 px-4 py-2 rounded-full text-xs font-black uppercase">Level 3: 60m+</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-top-4">
                                <div>
                                    <h3 className="font-black text-slate-400 mb-4 tracking-[0.2em] text-xs uppercase flex justify-between">
                                        Choose Skill Level
                                    </h3>
                                    <div className="flex gap-4">
                                        {[1, 2, 3].map(d => (
                                            <Button
                                                key={d}
                                                variant={difficulty === d ? 'primary' : 'secondary'}
                                                onClick={() => setDifficulty(d)}
                                                className={`flex-1 py-4 text-xl rounded-2xl ${difficulty === d ? 'ring-8 ring-indigo-50 shadow-xl' : 'opacity-80'}`}
                                            >
                                                LVL {d}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-black text-slate-400 mb-4 tracking-[0.2em] text-xs uppercase">
                                        Select Battleground
                                    </h3>
                                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
                                        {BACKGROUNDS.filter(b => b.id !== 'mountain' && b.id !== 'space').map(bg => (
                                            <button
                                                key={bg.id}
                                                onClick={() => setBgId(bg.id)}
                                                className={`group relative h-20 w-28 shrink-0 rounded-3xl border-4 transition-all hover:scale-110 snap-center overflow-hidden ${bg.css} ${bgId === bg.id ? 'border-indigo-500 shadow-xl scale-110 ring-8 ring-indigo-50' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                            >
                                                {bg.image && (
                                                    <Image src={bg.image} alt={bg.name} fill className="object-cover" />
                                                )}
                                                <div className={`absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors ${bgId === bg.id ? 'bg-transparent' : ''}`} />
                                                <div className="absolute bottom-1 left-0 w-full text-[10px] font-black text-white text-center drop-shadow-md tracking-tighter uppercase whitespace-nowrap px-1">
                                                    {bg.name}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-10">
                        <Button size="lg" className="group w-full text-3xl py-8 shadow-[0_15px_40px_-5px_rgba(79,70,229,0.5)] hover:shadow-[0_20px_50px_-5px_rgba(79,70,229,0.7)] hover:-translate-y-2 transition-all bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 border-b-[12px] border-indigo-900 active:border-b-0 active:translate-y-2 rounded-[2.5rem]" onClick={handleStart}>
                            <span className="group-hover:animate-bounce inline-block mr-4 text-4xl">
                                {bgId === 'mountain' ? '🧗' : '🚀'}
                            </span>
                            {bgId === 'mountain' ? 'CLIMB TO THE PEAK!' : 'BATTLE START!'}
                            <span className="group-hover:animate-bounce inline-block ml-4 delay-75 text-4xl">
                                {bgId === 'mountain' ? '🏔️' : '🔥'}
                            </span>
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
