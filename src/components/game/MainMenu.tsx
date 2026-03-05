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
    onHardStart: (settings: {
        p1Name: string;
        p1Char: string;
        p2Type: PlayerType;
        p2Name: string;
        p2Char: string;
        bgId: string;
    }) => void;
    onPracticeStart: (settings: {
        p1Name: string;
        p1Char: string;
        p2Name: string;
        p2Char: string;
        difficulty: number;
        topic: string;
    }) => void;
    onMiniGameStart: (characterId: string) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStart, onHardStart, onPracticeStart, onMiniGameStart }) => {
    const [view, setView] = useState<'AGE_SELECT' | 'MODE_SELECT' | 'SETTINGS' | 'PRACTICE_SELECT'>('AGE_SELECT');

    const [p1Name, setP1Name] = useState('Hero');
    const [p1Char, setP1Char] = useState(CHARACTERS[0].id);

    const [mode, setMode] = useState<PlayerType>('computer');
    const [p2Name, setP2Name] = useState('Computer');
    const [p2Char, setP2Char] = useState(CHARACTERS[2].id);

    const [difficulty, setDifficulty] = useState(1);
    const [bgId, setBgId] = useState('mountain');
    const [practiceTopic, setPracticeTopic] = useState('mixed');

    const handleSelectMode = (id: string) => {
        setBgId(id);
        setView('SETTINGS');
    };

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

    const handleHardStart = () => {
        onHardStart({
            p1Name,
            p1Char,
            p2Type: mode,
            p2Name: mode === 'computer' ? 'Computer' : p2Name,
            p2Char,
            bgId
        });
    };

    if (view === 'PRACTICE_SELECT') {
        const lessons = [
            { id: 'mixed', name: 'Mixed Review', icon: '🎓' },
            { id: '+', name: 'Addition', icon: '➕' },
            { id: '-', name: 'Subtraction', icon: '➖' },
            { id: '*', name: 'Multiplication', icon: '✖️' },
            { id: '/', name: 'Division', icon: '➗' },
            { id: 'compare', name: 'Comparing', icon: '⚖️' },
        ];

        return (
            <div className="min-h-screen bg-gradient-to-b from-emerald-400 to-teal-700 flex items-center justify-center p-4">
                <Card className="max-w-4xl w-full border-8 border-yellow-400 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] bg-white/95 backdrop-blur-md overflow-hidden animate-in zoom-in duration-500">
                    <div className="p-8 text-center relative bg-emerald-600">
                        <button
                            onClick={() => setView('MODE_SELECT')}
                            className="absolute top-6 left-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl font-black transition-all flex items-center gap-2"
                        >
                            👈 BACK
                        </button>
                        <h2 className="text-4xl font-black text-white mb-1 tracking-tighter drop-shadow-md">
                            🏫 PRACTICE CLASSROOM
                        </h2>
                        <p className="text-white/60 font-black text-xs uppercase tracking-[0.3em]">Master Your Skills</p>
                    </div>

                    <div className="p-8">
                        <div className="grid lg:grid-cols-3 gap-6 mb-10">
                            {/* Student Selection */}
                            <div className="bg-blue-50/50 p-6 rounded-[2.5rem] border-4 border-blue-100 shadow-inner">
                                <h2 className="text-2xl font-black text-blue-600 mb-6 flex items-center gap-3 text-sm">
                                    <span className="bg-white p-2 rounded-xl shadow-sm text-lg">🦸</span> CHOOSE STUDENT
                                </h2>
                                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200">
                                    {CHARACTERS.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => setP1Char(c.id)}
                                            className={`group relative p-3 rounded-2xl border-4 transition-all duration-300 hover:scale-102 flex items-center gap-4 ${p1Char === c.id ? 'bg-blue-100 border-blue-500 shadow-lg' : 'bg-white/50 border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <div className="w-16 h-16 flex-shrink-0 bg-white rounded-xl p-1 shadow-sm border border-blue-50">
                                                <Character id={c.id} fullBody size="sm" className="w-full h-full" />
                                            </div>
                                            <div className="flex-grow text-left">
                                                <span className={`text-sm font-black uppercase leading-tight ${p1Char === c.id ? 'text-blue-700' : 'text-slate-600'}`}>{c.name}</span>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Student</p>
                                            </div>
                                            {p1Char === c.id && (
                                                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in duration-300 mr-2">
                                                    <span className="text-sm">⭐</span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Teacher Selection */}
                            <div className="bg-emerald-50/50 p-6 rounded-[2.5rem] border-4 border-emerald-100 shadow-inner">
                                <h2 className="text-2xl font-black text-emerald-600 mb-6 flex items-center gap-3 text-sm">
                                    <span className="bg-white p-2 rounded-xl shadow-sm text-lg">🍎</span> CHOOSE TEACHER
                                </h2>
                                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-200">
                                    {CHARACTERS.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => setP2Char(c.id)}
                                            className={`group relative p-3 rounded-2xl border-4 transition-all duration-300 hover:scale-102 flex items-center gap-4 ${p2Char === c.id ? 'bg-emerald-100 border-emerald-500 shadow-lg' : 'bg-white/50 border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <div className="w-16 h-16 flex-shrink-0 bg-white rounded-xl p-1 shadow-sm border border-emerald-50">
                                                <Character id={c.id} fullBody size="sm" className="w-full h-full" />
                                            </div>
                                            <div className="flex-grow text-left">
                                                <span className={`text-sm font-black uppercase leading-tight ${p2Char === c.id ? 'text-emerald-700' : 'text-slate-600'}`}>{c.name}</span>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Teacher</p>
                                            </div>
                                            {p2Char === c.id && (
                                                <div className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in duration-300 mr-2">
                                                    <span className="text-sm">⭐</span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Lesson Selection */}
                            <div className="bg-teal-50/50 p-6 rounded-[2.5rem] border-4 border-teal-100 shadow-inner">
                                <h2 className="text-2xl font-black text-teal-600 mb-6 flex items-center gap-3 text-sm">
                                    <span className="bg-white p-2 rounded-xl shadow-sm text-lg">📚</span> CHOOSE LESSON
                                </h2>
                                <div className="grid grid-cols-2 gap-2">
                                    {lessons.map(lesson => (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setPracticeTopic(lesson.id)}
                                            className={`p-3 rounded-3xl border-4 transition-all flex flex-col items-center gap-1 ${practiceTopic === lesson.id ? 'bg-teal-500 border-teal-700 text-white shadow-lg scale-105' : 'bg-white border-teal-50 text-slate-600 hover:border-teal-200'}`}
                                        >
                                            <span className="text-xl">{lesson.icon}</span>
                                            <span className="font-black text-[10px] uppercase tracking-tighter text-center">{lesson.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="group w-full text-3xl py-8 shadow-[0_15px_40px_-5px_rgba(16,185,129,0.5)] bg-gradient-to-r from-emerald-600 to-teal-600 border-b-[12px] border-emerald-900 active:border-b-0 active:translate-y-2 rounded-[2.5rem]"
                            onClick={() => {
                                const teacher = CHARACTERS.find(c => c.id === p2Char);
                                onPracticeStart({
                                    p1Name,
                                    p1Char,
                                    p2Name: `Teacher ${teacher?.name || 'Pro'}`,
                                    p2Char,
                                    difficulty,
                                    topic: practiceTopic
                                });
                            }}
                        >
                            <span className="group-hover:animate-bounce inline-block mr-4 text-4xl">👩‍🏫</span>
                            START LESSON!
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (view === 'AGE_SELECT') {
        const ages = [
            { id: '4-', range: '4 & Under', diff: 0, icon: '🍼', color: 'from-pink-400 to-rose-500', desc: 'Waaaay easy! Just pick which is bigger! (1/2 vs 1/4)' },
            { id: '5-7', range: '5-7 Years', diff: 1, icon: '🐣', color: 'from-blue-400 to-cyan-500', desc: 'Easy fractions & simple addition' },
            { id: '8-9', range: '8-9 Years', diff: 2, icon: '🦊', color: 'from-orange-400 to-red-500', desc: 'Common denominators & subtraction' },
            { id: '11-16', range: '11-16 Years', diff: 3, icon: '🦉', color: 'from-indigo-500 to-purple-600', desc: 'Complex operations & mixed review' },
            { id: '17+', range: '17+ Years', diff: 4, icon: '🐉', color: 'from-rose-500 to-red-700', desc: 'Expert mode: denominators up to 50' },
            { id: 'any', range: "I DON'T CARE", diff: -1, icon: '🎲', color: 'from-slate-700 to-slate-900', desc: 'Surprise me! A mix of all levels!' }
        ];

        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                        <h1 className="text-6xl font-black text-white mb-2 tracking-tighter">WELCOME TO TEN FRACTIONS!</h1>
                        <p className="text-slate-400 font-black tracking-widest uppercase">First, let&apos;s pick your age group</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in zoom-in duration-500 delay-200">
                        {ages.map(age => (
                            <button
                                key={age.id}
                                onClick={() => {
                                    setDifficulty(age.diff);
                                    setView('MODE_SELECT');
                                }}
                                className={`group relative bg-gradient-to-br ${age.color} p-6 rounded-[2.5rem] border-4 border-white/10 hover:border-white transition-all shadow-2xl hover:scale-105 active:scale-95 text-center flex flex-col items-center gap-3`}
                            >
                                <div className="text-7xl mb-2 group-hover:animate-bounce drop-shadow-[0_5px_15px_rgba(255,255,255,0.4)] transition-transform duration-300">
                                    {age.icon}
                                </div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tighter">{age.range}</h2>
                                <p className="text-white/80 text-[10px] font-bold leading-tight line-clamp-2">{age.desc}</p>
                                <div className="mt-2 bg-black/20 text-white px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    SELECT →
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'MODE_SELECT') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-sky-400 to-indigo-600 flex items-center justify-center p-4">
                <div className="max-w-5xl w-full">
                    <div className="text-center mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
                        <h1 className="text-7xl sm:text-8xl font-black text-white mb-2 tracking-tighter drop-shadow-2xl">
                            TEN FRACTIONS
                        </h1>
                        <p className="text-white/80 font-black tracking-[0.4em] uppercase text-lg mb-6">🤖 Robots vs Dinosaurs 🦖</p>
                        <button
                            onClick={() => setView('AGE_SELECT')}
                            className="bg-white/10 hover:bg-white/20 text-white/80 hover:text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest border border-white/20 transition-all"
                        >
                            ← CHANGE AGE RANGE
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 animate-in zoom-in fade-in duration-500 delay-200">
                        {/* Mountain Climb Card */}
                        <button
                            onClick={() => handleSelectMode('mountain')}
                            className="group relative h-[450px] rounded-[3rem] overflow-hidden border-8 border-white/20 hover:border-sky-400 transition-all shadow-2xl hover:scale-[1.02] active:scale-95"
                        >
                            <Image src="/assets/mountain.png" alt="Mountain" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-sky-900/90 via-sky-900/40 to-transparent" />
                            <div className="absolute inset-0 flex flex-col items-center justify-end p-10 text-center">
                                <span className="bg-sky-400 text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest mb-4 shadow-xl">The Hero&apos;s Journey</span>
                                <h2 className="text-5xl font-black text-white mb-4 drop-shadow-lg">MOUNTAIN CLIMB</h2>
                                <p className="text-sky-100 font-bold mb-6 text-lg">Climb to the peak as problems get harder! 🏔️🧗</p>
                                <div className="bg-white text-sky-600 px-8 py-4 rounded-2xl font-black text-xl shadow-2xl group-hover:bg-sky-50 transition-colors">START JOURNEY 👉</div>
                            </div>
                            <div className="absolute top-6 right-6 text-5xl animate-pulse opacity-40">☁️</div>
                        </button>

                        {/* Classic Battle Card */}
                        <button
                            onClick={() => handleSelectMode('concert')}
                            className="group relative h-[450px] rounded-[3rem] overflow-hidden border-8 border-white/20 hover:border-indigo-400 transition-all shadow-2xl hover:scale-[1.02] active:scale-95"
                        >
                            <Image src="/assets/concert.png" alt="Concert" fill className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70" />
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/40 to-transparent" />
                            <div className="absolute inset-0 flex flex-col items-center justify-end p-10 text-center">
                                <span className="bg-indigo-400 text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest mb-4 shadow-xl">Head-to-Head</span>
                                <h2 className="text-5xl font-black text-white mb-4 drop-shadow-lg">CLASSIC BATTLE</h2>
                                <p className="text-indigo-100 font-bold mb-6 text-lg">Choose your arena and fight for points! ⚔️🎸</p>
                                <div className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-xl shadow-2xl group-hover:bg-indigo-50 transition-colors">CHOOSE ARENA 👉</div>
                            </div>
                            <div className="absolute top-6 left-6 text-5xl animate-bounce-slow opacity-40">🎵</div>
                        </button>

                        {/* Practice Classroom Card */}
                        <button
                            onClick={() => {
                                setBgId('forest'); // Set a cozy background for practice
                                setView('PRACTICE_SELECT');
                            }}
                            className="group md:col-span-2 relative h-[300px] rounded-[3rem] overflow-hidden border-8 border-white/20 hover:border-emerald-400 transition-all shadow-2xl hover:scale-[1.01] active:scale-95"
                        >
                            <Image src="/assets/forest.png" alt="Forest" fill className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" />
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-emerald-900/40 to-transparent" />
                            <div className="absolute inset-0 flex flex-col items-start justify-center p-12 text-left">
                                <span className="bg-emerald-400 text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest mb-4 shadow-xl">Guided Learning</span>
                                <h2 className="text-5xl font-black text-white mb-2 drop-shadow-lg">PRACTICE CLASSROOM</h2>
                                <p className="text-emerald-100 font-bold mb-6 text-lg max-w-xl">Choose a teacher and master specific skills! 🍎✨</p>
                                <div className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black text-xl shadow-2xl group-hover:bg-emerald-50 transition-colors">ENTER CLASSROOM 👉</div>
                            </div>
                            <div className="absolute top-6 right-12 text-6xl animate-float opacity-40">🍃</div>
                        </button>

                        {/* Amazing Mini-Game Card */}
                        <button
                            onClick={() => onMiniGameStart(p1Char)}
                            className="group md:col-span-2 relative h-[350px] rounded-[3rem] overflow-hidden border-8 border-white/40 hover:border-yellow-400 transition-all shadow-2xl hover:scale-[1.01] active:scale-95 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500"
                        >
                            <div className="absolute inset-0 opacity-40 mix-blend-overlay animate-pulse">
                                <div className="absolute top-10 left-10 text-6xl">✨</div>
                                <div className="absolute bottom-10 right-10 text-6xl">🌈</div>
                                <div className="absolute top-1/2 left-1/4 text-4xl">⭐</div>
                                <div className="absolute top-1/3 right-1/4 text-5xl">🎈</div>
                            </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                                <span className="bg-yellow-400 text-black px-8 py-3 rounded-full font-black text-lg uppercase tracking-[0.2em] mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] animate-bounce">
                                    THE AMAZING GAME! 🌟
                                </span>
                                <h2 className="text-6xl font-black text-white mb-4 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                                    FRACTION FEAST! 🍎
                                </h2>
                                <p className="text-white font-black text-2xl mb-8 max-w-xl drop-shadow-md">
                                    Catch as many treats as you can in this colorful, fun, and fast race! 🌈🚀
                                </p>
                                <div className="bg-white text-indigo-900 px-12 py-5 rounded-[2rem] font-black text-3xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-all group-hover:scale-110 active:scale-95">
                                    PLAY NOW! 🎮
                                </div>
                            </div>
                            <div className="absolute bottom-6 left-12 flex gap-4">
                                <Character id={p1Char} fullBody size="md" className="drop-shadow-2xl animate-bounce" />
                            </div>
                        </button>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes bounce-slow {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-15px); }
                    }
                    .animate-bounce-slow {
                        animation: bounce-slow 4s ease-in-out infinite;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-400 to-indigo-600 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full border-8 border-yellow-400 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] bg-white/95 backdrop-blur-md overflow-hidden animate-in zoom-in duration-500">
                {/* Header with Back Button */}
                <div className={`p-8 text-center relative ${bgId === 'mountain' ? 'bg-sky-600' : 'bg-indigo-700'}`}>
                    <button
                        onClick={() => setView('MODE_SELECT')}
                        className="absolute top-6 left-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl font-black transition-all flex items-center gap-2"
                    >
                        👈 BACK
                    </button>
                    <h2 className="text-4xl font-black text-white mb-1 tracking-tighter drop-shadow-md">
                        {bgId === 'mountain' ? '🏔️ MOUNTAIN CLIMB SETTINGS' : '⚔️ BATTLE SETTINGS'}
                    </h2>
                    <p className="text-white/60 font-black text-xs uppercase tracking-[0.3em]">Configure Your Heroes</p>
                </div>

                <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-8 mb-10">
                        {/* Player 1 Settings */}
                        <div className="bg-blue-50/50 p-6 rounded-[2.5rem] border-4 border-blue-100 shadow-inner">
                            <h2 className="text-2xl font-black text-blue-600 mb-6 flex items-center gap-3">
                                <span className="bg-white p-2 rounded-xl shadow-sm text-lg">🤖</span> HERO NAME
                            </h2>
                            <div className="mb-6">
                                <input
                                    value={p1Name}
                                    onChange={e => setP1Name(e.target.value)}
                                    className="w-full p-4 border-4 border-blue-100 rounded-3xl font-black text-xl text-blue-900 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-3 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                                {CHARACTERS.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => setP1Char(c.id)}
                                        className={`group relative p-3 rounded-3xl border-4 transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center gap-1 ${p1Char === c.id ? 'bg-blue-100 border-blue-500 shadow-xl ring-4 ring-blue-50' : 'bg-white/50 border-transparent hover:border-blue-200 opacity-80 hover:opacity-100'}`}
                                    >
                                        <div className="relative w-16 h-16 flex items-center justify-center">
                                            <Character id={c.id} fullBody size="sm" className="w-full h-full" />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-tighter ${p1Char === c.id ? 'text-blue-600' : 'text-slate-400'}`}>
                                            {c.name}
                                        </span>
                                        {p1Char === c.id && <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-[10px] shadow-lg border-2 border-white animate-in zoom-in">⭐</div>}
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

                            <div className="grid grid-cols-4 gap-3 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rose-200 scrollbar-track-transparent">
                                {CHARACTERS.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => setP2Char(c.id)}
                                        className={`group relative p-3 rounded-3xl border-4 transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center gap-1 ${p2Char === c.id ? 'bg-rose-100 border-rose-500 shadow-xl ring-4 ring-rose-50' : 'bg-white/50 border-transparent hover:border-rose-200 opacity-80 hover:opacity-100'}`}
                                    >
                                        <div className="relative w-16 h-16 flex items-center justify-center">
                                            <Character id={c.id} fullBody size="sm" className="w-full h-full" />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-tighter ${p2Char === c.id ? 'text-rose-600' : 'text-slate-400'}`}>
                                            {c.name}
                                        </span>
                                        {p2Char === c.id && <div className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-[10px] shadow-lg border-2 border-white animate-in zoom-in">👾</div>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Arena selection (Only for Classic Battle) */}
                    <div className="bg-slate-50/50 p-6 rounded-[2.5rem] border-4 border-slate-100 shadow-inner">
                        {bgId === 'mountain' ? (
                            <div className="flex flex-col md:flex-row items-center gap-8 animate-in fade-in slide-in-from-top-4">
                                <div className="relative w-full md:w-1/3 aspect-video rounded-3xl overflow-hidden border-8 border-sky-300 shadow-2xl scale-105">
                                    <Image src="/assets/mountain.png" alt="Mountain" fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-black text-sky-600 mb-2">🏔️ PROGRESSIVE CLIMB</h3>
                                    <p className="text-slate-500 font-bold leading-relaxed">
                                        You&apos;ll start at Level 1 and scale up to Level 3 as you climb higher!
                                    </p>
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
                                        {BACKGROUNDS.filter(b => b.id !== 'mountain').map(bg => (
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

                    <div className="mt-10 flex flex-col md:flex-row gap-4">
                        <Button
                            size="lg"
                            className={`group flex-[2] text-3xl py-8 shadow-[0_15px_40px_-5px_rgba(79,70,229,0.5)] hover:shadow-[0_20px_50px_-5px_rgba(79,70,229,0.7)] hover:-translate-y-2 transition-all bg-gradient-to-r ${bgId === 'mountain' ? 'from-sky-600 via-blue-600 to-sky-600 border-indigo-900' : 'from-indigo-600 via-violet-600 to-indigo-600 border-indigo-900'} border-b-[12px] active:border-b-0 active:translate-y-2 rounded-[2.5rem]`}
                            onClick={handleStart}
                        >
                            <span className="group-hover:animate-bounce inline-block mr-4 text-4xl">
                                {bgId === 'mountain' ? '🧗' : '🚀'}
                            </span>
                            {bgId === 'mountain' ? 'START CLIMB!' : 'BATTLE START!'}
                            <span className="group-hover:animate-bounce inline-block ml-4 delay-75 text-4xl">
                                {bgId === 'mountain' ? '🏔️' : '🔥'}
                            </span>
                        </Button>

                        {bgId !== 'mountain' && (
                            <Button
                                size="lg"
                                className="group flex-1 text-2xl py-8 shadow-[0_15px_40px_-5px_rgba(225,29,72,0.5)] hover:shadow-[0_20px_50px_-5px_rgba(225,29,72,0.7)] hover:-translate-y-2 transition-all bg-gradient-to-r from-rose-600 via-orange-600 to-rose-600 border-b-[12px] border-rose-900 active:border-b-0 active:translate-y-2 rounded-[2.5rem]"
                                onClick={handleHardStart}
                            >
                                <span className="group-hover:animate-bounce inline-block mr-2 text-3xl">🔥</span>
                                HARD ROUND
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};
