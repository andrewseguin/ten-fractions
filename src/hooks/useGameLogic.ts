import { useState, useEffect, useCallback, useRef } from 'react';
import { MAX_ROUNDS, POINTS_PER_DIFFICULTY, PlayerType } from '@/lib/constants';
import { generateProblem, compareFractions, Fraction, addFractions, subtractFractions, multiplyFractions, divideFractions } from '@/lib/fractions';
import { generateAIAnswer, shouldAIError } from '@/lib/ai';
import { getStepByStep } from '@/lib/steps';

export type GameState = 'MENU' | 'PLAYING' | 'GAME_OVER';

export type Player = {
    id: string;
    name: string;
    type: PlayerType;
    score: number;
    characterId: string;
};

export type Problem = {
    f1: Fraction;
    f2: Fraction;
    operation: string;
    correctAnswer?: Fraction | number;
};

export const useGameLogic = () => {
    const [gameState, setGameState] = useState<GameState>('MENU');
    const [round, setRound] = useState(1);
    const [difficulty, setDifficulty] = useState(1);

    const [player1, setPlayer1] = useState<Player>({ id: 'p1', name: 'Player 1', type: 'human', score: 0, characterId: 'hero1' });
    const [player2, setPlayer2] = useState<Player>({ id: 'p2', name: 'Computer', type: 'computer', score: 0, characterId: 'hero2' });

    const [currentTurn, setCurrentTurn] = useState<'p1' | 'p2'>('p1');
    const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
    const [isThinking, setIsThinking] = useState(false);

    // Speed Round States
    const [isSpeedRound, setIsSpeedRound] = useState(false);
    const [timeLeft, setTimeLeft] = useState(20);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctVal: any; steps?: string[]; isTimeout?: boolean } | null>(null);

    const advanceTurn = useCallback(() => {
        setFeedback(null);

        const nextTurn = currentTurn === 'p1' ? 'p2' : 'p1';

        // Transition Logic: Round 1-10 (Normal), then Round 11-? (Speed)
        if (currentTurn === 'p2' && round >= MAX_ROUNDS) {
            if (!isSpeedRound) {
                // Start Speed Round (Phase 2)
                setIsSpeedRound(true);
                setRound(11);
                setCurrentTurn('p1');
                setTimeLeft(20);
                const nextProb = generateProblem(difficulty);
                setCurrentProblem(nextProb);
                setIsThinking(false);
            } else if (round >= MAX_ROUNDS + 5) {
                setGameState('GAME_OVER');
                setIsThinking(false);
            } else {
                setRound(prev => prev + 1);
                setCurrentTurn('p1');
                setTimeLeft(20);
                const nextProb = generateProblem(difficulty);
                setCurrentProblem(nextProb);
            }
        } else {
            if (currentTurn === 'p2') {
                setRound(prev => prev + 1);
            }
            setCurrentTurn(nextTurn);
            setTimeLeft(20);

            if (nextTurn === 'p2' && player2.type === 'computer') {
                setIsThinking(true);
            } else {
                setIsThinking(false);
            }

            const nextProb = generateProblem(difficulty);
            setCurrentProblem(nextProb);
        }
    }, [currentTurn, round, difficulty, player2.type, isSpeedRound]);

    const handleTimeout = useCallback(() => {
        if (!currentProblem || feedback || !isSpeedRound) return;

        const { f1, f2, operation } = currentProblem;
        const steps = getStepByStep(f1, f2, operation);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let correctVal: any;
        switch (operation) {
            case '+': correctVal = addFractions(f1, f2); break;
            case '-': correctVal = subtractFractions(f1, f2); break;
            case '*': correctVal = multiplyFractions(f1, f2); break;
            case '/': correctVal = divideFractions(f1, f2); break;
            case 'compare': correctVal = compareFractions(f1, f2); break;
        }

        setFeedback({ isCorrect: false, correctVal, steps, isTimeout: true });

        setTimeout(() => {
            advanceTurn();
        }, 3000);
    }, [currentProblem, feedback, isSpeedRound, advanceTurn]);

    const startGame = (p1Name: string, p1Char: string, p2Type: PlayerType, p2Name: string, p2Char: string, diff: number) => {
        setPlayer1({ ...player1, name: p1Name, characterId: p1Char, score: 0 });
        const newP2 = { ...player2, name: p2Name, type: p2Type, characterId: p2Char, score: 0 };
        setPlayer2(newP2);
        setDifficulty(diff);
        setRound(1);
        setCurrentTurn('p1');
        setGameState('PLAYING');
        setIsSpeedRound(false);
        setTimeLeft(20);

        const prob = generateProblem(diff);
        setCurrentProblem(prob);
        setFeedback(null);
        setIsThinking(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkAnswer = useCallback((answer: any) => {
        if (!currentProblem || feedback) return;

        let isCorrect = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let correctVal: any;

        const { f1, f2, operation } = currentProblem;

        switch (operation) {
            case '+': correctVal = addFractions(f1, f2); break;
            case '-': correctVal = subtractFractions(f1, f2); break;
            case '*': correctVal = multiplyFractions(f1, f2); break;
            case '/': correctVal = divideFractions(f1, f2); break;
            case 'compare': correctVal = compareFractions(f1, f2); break;
        }

        if (operation === 'compare') {
            isCorrect = answer === correctVal;
        } else {
            const ansVal = (answer as Fraction).numerator / (answer as Fraction).denominator;
            const corVal = (correctVal as Fraction).numerator / (correctVal as Fraction).denominator;
            isCorrect = Math.abs(ansVal - corVal) < 0.0001;
        }

        const steps = !isCorrect ? getStepByStep(f1, f2, operation) : undefined;

        setFeedback({ isCorrect, correctVal, steps });

        const multiplier = isSpeedRound ? 2 : 1;
        const points = isCorrect ? POINTS_PER_DIFFICULTY[difficulty as keyof typeof POINTS_PER_DIFFICULTY] * multiplier : 0;

        if (currentTurn === 'p1') {
            setPlayer1(prev => ({ ...prev, score: prev.score + points }));
        } else {
            setPlayer2(prev => ({ ...prev, score: prev.score + points }));
        }

        const isComputer = currentTurn === 'p2' && player2.type === 'computer';

        if (isCorrect || isComputer) {
            setTimeout(() => {
                advanceTurn();
            }, 2000);
        }

        return { isCorrect, correctVal };
    }, [currentProblem, feedback, difficulty, currentTurn, player2.type, advanceTurn, isSpeedRound]);

    // Speed Round Timer Effect
    useEffect(() => {
        if (gameState === 'PLAYING' && isSpeedRound && !feedback && !isThinking) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        handleTimeout();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => {
                if (timerRef.current) clearInterval(timerRef.current);
            };
        }
    }, [gameState, isSpeedRound, feedback, isThinking, handleTimeout]);

    // AI Turn handling
    useEffect(() => {
        if (gameState === 'PLAYING' && currentTurn === 'p2' && player2.type === 'computer' && currentProblem && !feedback && isThinking) {
            const thinkingTime = isSpeedRound
                ? 1500 + Math.random() * 1000
                : 2000 + Math.random() * 2000;

            const timer = setTimeout(() => {
                const shouldErr = shouldAIError(difficulty);
                const aiAns = generateAIAnswer(currentProblem.f1, currentProblem.f2, currentProblem.operation, difficulty, shouldErr);
                setIsThinking(false);
                checkAnswer(aiAns);
            }, thinkingTime);

            return () => clearTimeout(timer);
        }
    }, [gameState, currentTurn, currentProblem, player2.type, difficulty, feedback, isThinking, checkAnswer, isSpeedRound]);

    return {
        gameState,
        round,
        difficulty,
        player1,
        player2,
        currentTurn,
        currentProblem,
        feedback,
        isThinking,
        isSpeedRound,
        timeLeft,
        startGame,
        checkAnswer,
        advanceTurn,
        resetGame: () => setGameState('MENU')
    };
};
