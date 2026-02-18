import React, { useState } from 'react';
import { Fraction } from '@/lib/fractions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FractionDisplay } from './FractionDisplay';

type Answer = number | Fraction;

interface QuestionProps {
    f1: Fraction;
    f2: Fraction;
    operation: string;
    onAnswer: (ans: Answer) => void;
    disabled?: boolean;
}

export const Question: React.FC<QuestionProps> = ({ f1, f2, operation, onAnswer, disabled }) => {
    const [wholeInput, setWholeInput] = useState('');
    const [numInput, setNumInput] = useState('');
    const [denomInput, setDenomInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!numInput || !denomInput) return;

        const w = parseInt(wholeInput) || 0;
        const n = parseInt(numInput);
        const d = parseInt(denomInput);

        // Convert mixed number to improper fraction: (whole * denom + num) / denom
        onAnswer({
            numerator: w * d + n,
            denominator: d
        });

        setWholeInput('');
        setNumInput('');
        setDenomInput('');
    };

    if (operation === 'compare') {
        return (
            <Card className="text-center border-8 border-yellow-300 shadow-xl bg-white/95 overflow-hidden">
                <h3 className="text-2xl font-black text-slate-400 mb-6 uppercase tracking-widest">Click the Bigger One!</h3>
                <div className="flex items-center justify-center gap-4 sm:gap-12 text-slate-700 mb-6">
                    {/* Left Fraction Card */}
                    <button
                        disabled={disabled}
                        onClick={() => onAnswer(1)}
                        className={`group relative bg-indigo-50 p-6 rounded-[2.5rem] shadow-lg border-4 border-indigo-100 text-indigo-600 transform hover:scale-105 active:scale-95 transition-all outline-none focus:ring-4 ring-indigo-300 ${disabled ? 'opacity-50 grayscale' : ''}`}
                    >
                        <div className="absolute -top-4 -left-4 bg-indigo-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Left</div>
                        <FractionDisplay numerator={f1.numerator} denominator={f1.denominator} size="xl" />
                        <div className="absolute inset-x-0 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-black uppercase tracking-widest bg-white/80 px-4 py-1 rounded-full shadow-sm">This one is bigger?</span>
                        </div>
                    </button>

                    {/* Equal Sign Button */}
                    <button
                        disabled={disabled}
                        onClick={() => onAnswer(0)}
                        className={`group bg-yellow-400 hover:bg-yellow-300 text-white w-20 h-20 rounded-full flex items-center justify-center border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all shadow-xl hover:scale-110 ${disabled ? 'opacity-50 grayscale' : 'animate-pulse'}`}
                    >
                        <span className="text-5xl font-black">=</span>
                    </button>

                    {/* Right Fraction Card */}
                    <button
                        disabled={disabled}
                        onClick={() => onAnswer(-1)}
                        className={`group relative bg-rose-50 p-6 rounded-[2.5rem] shadow-lg border-4 border-rose-100 text-rose-600 transform hover:scale-105 active:scale-95 transition-all outline-none focus:ring-4 ring-rose-300 ${disabled ? 'opacity-50 grayscale' : ''}`}
                    >
                        <div className="absolute -top-4 -right-4 bg-rose-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Right</div>
                        <FractionDisplay numerator={f2.numerator} denominator={f2.denominator} size="xl" />
                        <div className="absolute inset-x-0 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-black uppercase tracking-widest bg-white/80 px-4 py-1 rounded-full shadow-sm">This one is bigger?</span>
                        </div>
                    </button>
                </div>

                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-bounce">Select the largest fraction or the = sign</p>
            </Card>
        );
    }

    // Arithmetic
    let opSymbol = operation;
    if (operation === '*') opSymbol = '×';
    if (operation === '/') opSymbol = '÷';
    if (operation === '+') opSymbol = '+';
    if (operation === '-') opSymbol = '-';

    return (
        <Card className="text-center max-w-lg mx-auto border-8 border-indigo-300 shadow-xl bg-white/95">
            <h3 className="text-2xl font-black text-slate-400 mb-6 uppercase tracking-widest">Solve It!</h3>
            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-700 mb-10">
                <div className="bg-slate-100 p-4 rounded-2xl shadow-inner">
                    <FractionDisplay numerator={f1.numerator} denominator={f1.denominator} size="lg" />
                </div>

                <div className="text-indigo-500 font-black text-6xl">{opSymbol}</div>

                <div className="bg-slate-100 p-4 rounded-2xl shadow-inner">
                    <FractionDisplay numerator={f2.numerator} denominator={f2.denominator} size="lg" />
                </div>

                <div className="text-slate-400 text-4xl">=</div>

                <div className="flex items-center gap-3">
                    {/* Whole Number Space */}
                    <div className="flex flex-col items-center bg-blue-50 p-4 rounded-2xl border-4 border-blue-200">
                        <input
                            type="number"
                            value={wholeInput}
                            onChange={e => setWholeInput(e.target.value)}
                            className="w-16 text-center font-black text-3xl outline-none bg-transparent placeholder-blue-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="?"
                            disabled={disabled}
                        />
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Whole</span>
                    </div>

                    {/* Fraction Parts */}
                    <div className="flex flex-col items-center gap-2 bg-yellow-50 p-4 rounded-2xl border-4 border-yellow-200">
                        <input
                            type="number"
                            value={numInput}
                            onChange={e => setNumInput(e.target.value)}
                            className="w-20 text-center font-black text-3xl outline-none bg-transparent placeholder-yellow-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="?"
                            disabled={disabled}
                        />
                        <div className="w-full h-1.5 bg-slate-800 rounded-full"></div>
                        <input
                            type="number"
                            value={denomInput}
                            onChange={e => setDenomInput(e.target.value)}
                            className="w-20 text-center font-black text-3xl outline-none bg-transparent placeholder-yellow-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="?"
                            disabled={disabled}
                        />
                    </div>
                </div>
            </div>
            <Button disabled={disabled || !numInput || !denomInput} onClick={handleSubmit} size="lg" className="w-full text-xl py-4 bg-green-500 hover:bg-green-400 border-b-8 border-green-700 active:border-b-0 active:translate-y-2 disabled:bg-slate-300 disabled:border-slate-400">
                CHECK ANSWER
            </Button>
        </Card>
    );
};
