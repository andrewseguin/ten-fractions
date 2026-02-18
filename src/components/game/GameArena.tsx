'use client';

import React from 'react';
import Image from 'next/image';
import { useGameLogic } from '@/hooks/useGameLogic';
import { Character } from './Character';
import { Question } from './Question';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BACKGROUNDS as BG_CONSTANTS, MAX_ROUNDS } from '@/lib/constants';
import { FractionDisplay } from './FractionDisplay';
import { Fraction } from '@/lib/fractions';

type GameLogic = ReturnType<typeof useGameLogic>;

interface GameArenaProps {
    game: GameLogic;
    bgId?: string; // Accept bgId from MainMenu
}

export const GameArena: React.FC<GameArenaProps> = ({ game, bgId = 'concert' }) => {
    const {
        gameState,
        round,
        player1,
        player2,
        currentTurn,
        currentProblem,
        feedback,
        isThinking,
        checkAnswer,
        resetGame,
        advanceTurn
    } = game;

    const bg = BG_CONSTANTS.find(b => b.id === bgId) || BG_CONSTANTS[0];

    if (gameState === 'GAME_OVER') {
        const winner = player1.score > player2.score ? player1 : player2.score > player1.score ? player2 : null;
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center border-8 border-white/20 bg-white/90 backdrop-blur-xl shadow-2xl animate-in zoom-in duration-500">
                    <h1 className="text-5xl font-black text-indigo-600 mb-8 drop-shadow-sm">GAME OVER!</h1>

                    <div className="mb-8 bg-slate-50 rounded-3xl p-8 border-4 border-slate-100">
                        {winner ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="relative inline-block">
                                    <Character id={winner.characterId} className="mx-auto mb-6 scale-125 shadow-xl ring-4 ring-yellow-400" size="lg" />
                                    <div className="absolute -top-4 -right-4 text-4xl animate-bounce">👑</div>
                                </div>
                                <p className="text-3xl font-black text-slate-800 mb-2">{winner.name} Wins!</p>
                                <p className="text-indigo-500 font-bold text-xl">Score: {winner.score}</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-3xl font-black text-slate-800">It&apos;s a Tie!</p>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t-2 border-slate-200 grid grid-cols-2 gap-4">
                            <div className="text-center p-2 rounded-xl bg-blue-50">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Player 1</p>
                                <p className="text-2xl font-black text-blue-600">{player1.score}</p>
                            </div>
                            <div className="text-center p-2 rounded-xl bg-orange-50">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Player 2</p>
                                <p className="text-2xl font-black text-orange-600">{player2.score}</p>
                            </div>
                        </div>
                    </div>

                    <Button onClick={resetGame} size="lg" className="w-full text-xl py-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">Play Again 🔄</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${!bg.image ? bg.css : ''} text-white p-4 flex flex-col justify-between overflow-hidden relative`}>
            {/* Background Image */}
            {bg.image && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={bg.image}
                        alt={bg.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Overlay to ensure readability */}
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
                </div>
            )}

            {/* Background Flair (Floating particles) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40 z-1">
                <div className="absolute top-10 left-10 text-6xl animate-pulse">✨</div>
                <div className="absolute bottom-20 right-20 text-5xl animate-pulse delay-700">💫</div>
                <div className="absolute top-1/4 right-1/4 text-4xl animate-bounce">⭐</div>
            </div>

            {/* Header / Scoreboard */}
            <header className="flex justify-between items-center max-w-5xl mx-auto w-full mb-8 relative z-10">
                <div className={`flex items-center gap-4 p-4 pr-8 rounded-2xl transition-all duration-500 ${currentTurn === 'p1' ? 'bg-white/20 backdrop-blur-md ring-4 ring-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.5)] scale-105' : 'bg-black/30 backdrop-blur-sm grayscale opacity-80'}`}>
                    <Character id={player1.characterId} size="md" className="shadow-lg" />
                    <div>
                        <p className="font-bold text-sm text-blue-200 uppercase tracking-widest mb-1">{player1.name}</p>
                        <p className="text-4xl font-black text-white drop-shadow-md">{player1.score}</p>
                    </div>
                </div>

                <div className="text-center">
                    <div className="bg-black/40 px-8 py-3 rounded-full backdrop-blur-md border-2 border-white/20 shadow-2xl">
                        <span className="font-bold text-slate-300 text-xs tracking-[0.2em] block mb-1 uppercase">Round</span>
                        <p className="text-4xl font-black text-white leading-tight">{round}<span className="text-slate-400 text-2xl">/{MAX_ROUNDS}</span></p>
                    </div>
                </div>

                <div className={`flex flex-row-reverse items-center gap-4 p-4 pl-8 rounded-2xl transition-all duration-500 ${currentTurn === 'p2' ? 'bg-white/20 backdrop-blur-md ring-4 ring-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.5)] scale-105' : 'bg-black/30 backdrop-blur-sm grayscale opacity-80'}`}>
                    <div className="relative">
                        <Character id={player2.characterId} size="md" className={`shadow-lg ${isThinking ? 'animate-pulse scale-110' : ''}`} />
                        {isThinking && (
                            <div className="absolute -top-12 -left-8 animate-bounce z-20">
                                <div className="bg-white text-indigo-600 font-black px-4 py-2 rounded-2xl shadow-xl relative after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-white">
                                    Thinking...
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-sm text-rose-200 uppercase tracking-widest mb-1">{player2.name}</p>
                        <p className="text-4xl font-black text-white drop-shadow-md">{player2.score}</p>
                    </div>
                </div>
            </header>

            {/* Main Action Area */}
            <main className="flex-1 flex items-center justify-center relative z-10 w-full mb-12">

                {/* Feedback Overlay */}
                {feedback && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto">
                        <div className={`p-8 rounded-[3rem] shadow-2xl text-center transform animate-in zoom-in fade-in slide-in-from-bottom-8 duration-300 border-8 border-white/20 backdrop-blur-md ${feedback.isCorrect ? 'bg-green-500' : 'bg-rose-500'} max-w-2xl w-full mx-4`}>
                            <div className="text-7xl mb-2 animate-bounce">
                                {feedback.isCorrect ? '🎉' : '💥'}
                            </div>
                            <h2 className="text-5xl font-black text-white mb-4 drop-shadow-md">
                                {feedback.isCorrect ? 'AWESOME!' : 'OOPS!'}
                            </h2>

                            {!feedback.isCorrect && feedback.steps && (
                                <div className="bg-white/10 rounded-2xl p-6 text-left max-h-[50vh] overflow-y-auto custom-scrollbar shadow-inner">
                                    <p className="text-white font-bold text-xl mb-4 border-b border-white/20 pb-2">Let&apos;s solve this:</p>
                                    <ul className="space-y-4">
                                        {feedback.steps.map((step, i) => (
                                            <li key={i} className="text-white font-medium text-lg flex gap-3 leading-snug">
                                                <span className="bg-white/20 h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">{i + 1}</span>
                                                <span>{step}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-center gap-6">
                                        <p className="text-white/60 uppercase font-bold text-xs tracking-widest">The Correct Answer:</p>
                                        <div className="bg-white text-indigo-600 p-4 rounded-3xl shadow-lg ring-4 ring-white/20">
                                            {typeof feedback.correctVal === 'object' ? (
                                                <FractionDisplay numerator={(feedback.correctVal as Fraction).numerator} denominator={(feedback.correctVal as Fraction).denominator} size="md" />
                                            ) : (
                                                <span className="text-3xl font-black px-4">{feedback.correctVal}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!feedback.isCorrect && (
                                <div className="mt-8">
                                    <Button onClick={advanceTurn} size="lg" className="bg-white text-rose-600 hover:bg-rose-50 text-2xl w-full shadow-2xl py-6 rounded-3xl">
                                        GOT IT, NEXT! 👉
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="w-full max-w-2xl transition-all duration-500">
                    {currentProblem && (
                        <div className={`${(currentTurn === 'p2' && player2.type === 'computer') || isThinking ? 'opacity-40 scale-95 filter blur-[2px] pointer-events-none' : 'scale-100'} transition-all duration-500`}>
                            {!feedback && (
                                <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4">
                                    <span className={`inline-block px-8 py-3 rounded-full font-black text-xl uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(0,0,0,0.3)] ${currentTurn === 'p1' ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white'}`}>
                                        {isThinking ? 'Processing...' : (currentTurn === 'p1' ? player1.name + "'s Turn" : player2.name + "'s Turn")}
                                    </span>
                                </div>
                            )}

                            {isThinking && (
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <div className="bg-white/20 p-16 rounded-full animate-ping h-40 w-40 border-4 border-white/30"></div>
                                    <div className="absolute text-8xl transform animate-spin opacity-80">⚙️</div>
                                </div>
                            )}

                            <Question
                                f1={currentProblem.f1}
                                f2={currentProblem.f2}
                                operation={currentProblem.operation}
                                onAnswer={checkAnswer}
                                disabled={!!feedback || (currentTurn === 'p2' && player2.type === 'computer') || isThinking}
                            />
                        </div>
                    )}
                </div>
            </main>

            <footer className="text-center text-white/40 text-xs font-black p-4 relative z-10 uppercase tracking-[0.3em]">
                Ten Fractions • {bg.name} Arena • Difficulty {game.difficulty}
            </footer>
        </div>
    );
};
