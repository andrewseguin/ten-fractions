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
    bgId?: string;
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
        isSpeedRound,
        isMountainMode,
        timeLeft,
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
                                <p className="text-indigo-500 font-bold text-xl">Final Score: {winner.score}</p>
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

    // Calculate vertical ascent for mountain mode
    const getClimbStyle = (elevation: number) => {
        if (!isMountainMode) return {};
        // Start from a lower point and climb up
        // Base translateY is 0 (at bottom of its area)
        return {
            transform: `translateY(${-elevation * 4.5}px)`, // More aggressive climb
            transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
        };
    };

    return (
        <div className={`min-h-screen ${!bg.image ? bg.css : ''} text-white p-4 flex flex-col justify-start overflow-hidden relative transition-colors duration-500 ${(isSpeedRound || isMountainMode) && timeLeft < 5 ? 'bg-rose-900/40' : ''}`}>
            {/* Background Image */}
            {bg.image && (
                <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isSpeedRound ? 'opacity-70' : 'opacity-100'}`}>
                    <Image
                        src={bg.image}
                        alt={bg.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className={`absolute inset-0 transition-colors duration-500 ${isSpeedRound ? 'bg-indigo-900/40' : 'bg-black/30'} backdrop-blur-[1px]`} />
                </div>
            )}

            {/* Moving Background Objects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-1">
                {(bgId === 'mountain' || bgId === 'castle') && (
                    <>
                        <div className="absolute top-[10%] left-[-10%] text-7xl animate-move-horizontal opacity-60" style={{ animationDuration: '35s' }}>☁️</div>
                        <div className="absolute top-[25%] left-[-20%] text-6xl animate-move-horizontal opacity-40" style={{ animationDuration: '50s', animationDelay: '5s' }}>☁️</div>
                        <div className="absolute top-[15%] right-[-10%] text-8xl animate-move-horizontal-reverse opacity-50" style={{ animationDuration: '40s' }}>☁️</div>
                    </>
                )}

                {bgId === 'concert' && (
                    <>
                        <div className="absolute top-1/4 left-1/4 text-4xl animate-float opacity-80">🎵</div>
                        <div className="absolute top-1/3 right-1/4 text-5xl animate-float-delayed opacity-70">🎶</div>
                        <div className="absolute bottom-1/4 left-1/2 text-3xl animate-bounce-slow opacity-60">🎸</div>
                    </>
                )}

                {bgId === 'dinoland' && (
                    <>
                        <div className="absolute top-10 right-[-10%] text-5xl animate-move-horizontal-reverse opacity-80" style={{ animationDuration: '20s' }}>🦅</div>
                        <div className="absolute top-1/4 left-[-10%] text-4xl animate-move-horizontal opacity-70" style={{ animationDuration: '25s', animationDelay: '2s' }}>🦖</div>
                    </>
                )}

                <div className="absolute top-10 left-10 text-4xl animate-pulse opacity-50">✨</div>
                <div className="absolute bottom-20 right-20 text-3xl animate-pulse delay-700 opacity-40">💫</div>
            </div>

            {/* Top Area: Status & Problem (The Peak Goal) */}
            <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center gap-6 pt-4">
                {/* Round Info Banner */}
                <div className={`bg-black/60 px-8 py-3 rounded-full backdrop-blur-md border-2 transition-all duration-300 ${isSpeedRound ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]' : isMountainMode ? 'border-sky-400 ring-4 ring-sky-400/20' : 'border-white/20 shadow-2xl'}`}>
                    <span className={`font-black text-xs tracking-[0.3em] block mb-1 uppercase text-center ${isSpeedRound ? 'text-yellow-400' : isMountainMode ? 'text-sky-300' : 'text-slate-300'}`}>
                        {isSpeedRound ? '⚡ SPEED ROUND ⚡' : isMountainMode ? '🧗 MOUNTAIN CLIMB 🧗' : 'Normal Round'}
                    </span>
                    <p className="text-2xl font-black text-white leading-tight text-center">
                        Round {round}<span className="text-slate-400 text-lg">/{isMountainMode ? MAX_ROUNDS + 10 : isSpeedRound ? MAX_ROUNDS + 5 : MAX_ROUNDS}</span>
                    </p>
                </div>

                {/* The Problem (At the Peak for Mountain Mode) */}
                <div className={`w-full max-w-2xl transition-all duration-500 ${(isSpeedRound || isMountainMode) && timeLeft < 5 && !feedback ? 'animate-shake' : ''}`}>
                    {currentProblem && (
                        <div className={`${(currentTurn === 'p2' && player2.type === 'computer') || isThinking ? 'opacity-40 scale-95 filter blur-[2px] pointer-events-none' : 'scale-100'} transition-all duration-500`}>
                            {!feedback && (
                                <div className="text-center mb-4 animate-in fade-in slide-in-from-top-4">
                                    <span className={`inline-block px-8 py-2 rounded-full font-black text-lg uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(0,0,0,0.3)] ${isSpeedRound ? 'bg-yellow-400 text-black animate-pulse' : isMountainMode ? 'bg-sky-500 text-white' : (currentTurn === 'p1' ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white')}`}>
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

                {/* Timer (Floating near the problem) */}
                {(isSpeedRound || isMountainMode) && !feedback && !isThinking && (
                    <div className={`w-20 h-20 rounded-full border-8 bg-black/60 backdrop-blur-md flex items-center justify-center transition-all duration-300 ${timeLeft < 5 ? 'border-rose-500 text-rose-500 scale-125 animate-bounce' : 'border-white text-white'}`}>
                        <span className="text-3xl font-black">{timeLeft}s</span>
                    </div>
                )}
            </div>

            {/* Bottom Area: Climbers & Scores */}
            <div className={`relative z-10 w-full max-w-5xl mx-auto flex justify-between items-end ${isMountainMode ? 'pb-24' : 'pb-12'}`}>

                {/* Player 1 Card (Climbing up from bottom) */}
                <div
                    className={`flex items-center gap-4 p-4 pr-8 rounded-2xl transition-all duration-500 ${currentTurn === 'p1' ? 'bg-white/20 backdrop-blur-md ring-4 ring-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.5)] scale-105' : 'bg-black/30 backdrop-blur-sm grayscale opacity-80'}`}
                    style={getClimbStyle(player1.elevation)}
                >
                    <Character id={player1.characterId} size="md" className="shadow-lg" />
                    <div>
                        <p className="font-bold text-sm text-blue-200 uppercase tracking-widest mb-1">{player1.name}</p>
                        <p className="text-4xl font-black text-white drop-shadow-md">{player1.score}</p>
                        {isMountainMode && <p className="text-xs font-black text-sky-400 bg-black/40 px-2 py-0.5 rounded-full inline-block mt-1">⛰️ {player1.elevation}m</p>}
                    </div>
                </div>

                {/* Player 2 Card (Climbing up from bottom) */}
                <div
                    className={`flex flex-row-reverse items-center gap-4 p-4 pl-8 rounded-2xl transition-all duration-500 ${currentTurn === 'p2' ? 'bg-white/20 backdrop-blur-md ring-4 ring-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.5)] scale-105' : 'bg-black/30 backdrop-blur-sm grayscale opacity-80'}`}
                    style={getClimbStyle(player2.elevation)}
                >
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
                        {isMountainMode && <p className="text-xs font-black text-sky-400 bg-black/40 px-2 py-0.5 rounded-full inline-block mt-1">⛰️ {player2.elevation}m</p>}
                    </div>
                </div>
            </div>

            {/* Feedback Overlay (Same as before but z-index to 100) */}
            {feedback && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-auto bg-black/60 backdrop-blur-md">
                    <div className={`p-8 rounded-[3rem] shadow-2xl text-center transform animate-in zoom-in fade-in slide-in-from-bottom-8 duration-300 border-8 border-white/20 backdrop-blur-md ${feedback.isCorrect ? 'bg-green-500 shadow-green-500/50' : 'bg-rose-500 shadow-rose-500/50'} max-w-2xl w-full mx-4`}>
                        <div className="text-7xl mb-2 animate-bounce">
                            {feedback.isCorrect ? '🎉' : feedback.isTimeout ? '⏰' : '💥'}
                        </div>
                        <h2 className="text-5xl font-black text-white mb-4 drop-shadow-md">
                            {feedback.isCorrect ? 'AWESOME!' : feedback.isTimeout ? 'TIME OUT!' : 'OOPS!'}
                        </h2>

                        {isMountainMode && (
                            <p className="text-white/90 text-2xl font-black mb-6 animate-pulse">
                                {feedback.isCorrect ? 'CLIMBING UP! 🧗' : 'SLIDING DOWN! ⛷️'}
                            </p>
                        )}

                        {!feedback.isCorrect && feedback.steps && (
                            <div className="bg-white/10 rounded-2xl p-6 text-left max-h-[50vh] overflow-y-auto custom-scrollbar shadow-inner">
                                <p className="text-white font-bold text-xl mb-4 border-b border-white/20 pb-2">
                                    {feedback.isTimeout ? "You ran out of time! Here's how to solve it:" : "Let's solve this:"}
                                </p>
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

            <footer className="text-center text-white/20 text-[10px] font-black p-2 relative z-10 uppercase tracking-[0.4em]">
                Ten Fractions • {bg.name} Arena • Elevation Mode
            </footer>

            <style jsx global>{`
          @keyframes move-horizontal {
            from { transform: translateX(-20vw); }
            to { transform: translateX(120vw); }
          }
          @keyframes move-horizontal-reverse {
            from { transform: translateX(120vw); }
            to { transform: translateX(-20vw); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }
          .animate-move-horizontal {
            animation: move-horizontal linear infinite;
          }
          .animate-move-horizontal-reverse {
            animation: move-horizontal-reverse linear infinite;
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float 6s ease-in-out infinite 1s;
          }
          .animate-bounce-slow {
            animation: bounce-slow 3s ease-in-out infinite;
          }
          .animate-shake {
            animation: shake 0.1s ease-in-out infinite;
          }
       `}</style>
        </div>
    );
};
