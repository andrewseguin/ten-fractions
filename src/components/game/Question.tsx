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
    const [numInput, setNumInput] = useState('');
    const [denomInput, setDenomInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!numInput || !denomInput) return;
        onAnswer({
            numerator: parseInt(numInput),
            denominator: parseInt(denomInput)
        });
        setNumInput('');
        setDenomInput('');
    };

    if (operation === 'compare') {
        return (
            <Card className="text-center border-8 border-yellow-300 shadow-xl bg-white/95">
                <h3 className="text-2xl font-black text-slate-400 mb-6 uppercase tracking-widest">Which is bigger?</h3>
                <div className="flex items-center justify-center gap-4 sm:gap-12 text-slate-700 mb-10">
                    <div className="bg-indigo-50 p-6 rounded-3xl shadow-inner border-4 border-indigo-100 text-indigo-600 transform hover:scale-110 transition-transform cursor-default">
                        <FractionDisplay numerator={f1.numerator} denominator={f1.denominator} size="xl" />
                    </div>

                    <div className="text-3xl font-bold text-slate-300">vs</div>

                    <div className="bg-rose-50 p-6 rounded-3xl shadow-inner border-4 border-rose-100 text-rose-600 transform hover:scale-110 transition-transform cursor-default">
                        <FractionDisplay numerator={f2.numerator} denominator={f2.denominator} size="xl" />
                    </div>
                </div>
                <div className="flex gap-4 justify-center">
                    <Button disabled={disabled} onClick={() => onAnswer(-1)} size="lg" className="text-3xl px-8 py-4 bg-indigo-500 hover:bg-indigo-400 border-b-8 border-indigo-700 active:border-b-0 active:translate-y-2">&lt;</Button>
                    <Button disabled={disabled} onClick={() => onAnswer(0)} size="lg" className="text-3xl px-8 py-4 bg-yellow-500 hover:bg-yellow-400 border-b-8 border-yellow-700 active:border-b-0 active:translate-y-2">=</Button>
                    <Button disabled={disabled} onClick={() => onAnswer(1)} size="lg" className="text-3xl px-8 py-4 bg-rose-500 hover:bg-rose-400 border-b-8 border-rose-700 active:border-b-0 active:translate-y-2">&gt;</Button>
                </div>
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

                <div className="flex flex-col items-center gap-2 bg-yellow-50 p-4 rounded-2xl border-4 border-yellow-200">
                    <input
                        type="number"
                        value={numInput}
                        onChange={e => setNumInput(e.target.value)}
                        className="w-24 text-center font-black text-3xl border-b-4 border-slate-300 focus:border-indigo-500 outline-none bg-transparent placeholder-slate-300"
                        placeholder="?"
                        disabled={disabled}
                    />
                    <div className="w-full h-1.5 bg-slate-800 rounded-full"></div>
                    <input
                        type="number"
                        value={denomInput}
                        onChange={e => setDenomInput(e.target.value)}
                        className="w-24 text-center font-black text-3xl border-b-4 border-slate-300 focus:border-indigo-500 outline-none bg-transparent placeholder-slate-300"
                        placeholder="?"
                        disabled={disabled}
                    />
                </div>
            </div>
            <Button disabled={disabled || !numInput || !denomInput} onClick={handleSubmit} size="lg" className="w-full text-xl py-4 bg-green-500 hover:bg-green-400 border-b-8 border-green-700 active:border-b-0 active:translate-y-2 disabled:bg-slate-300 disabled:border-slate-400">
                CHECK ANSWER
            </Button>
        </Card>
    );
};
