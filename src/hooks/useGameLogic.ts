import { useState, useEffect, useCallback } from 'react';
import { MAX_ROUNDS, POINTS_PER_DIFFICULTY, PlayerType } from '@/lib/constants';
import { generateProblem, compareFractions, Fraction, addFractions, subtractFractions, multiplyFractions, divideFractions } from '@/lib/fractions';
import { generateAIAnswer, shouldAIError } from '@/lib/ai';
import { getStepByStep } from '@/lib/steps';

// ... types (GameState, Player, Problem) same as before ... 
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctVal: any; steps?: string[] } | null>(null);

    const startGame = (p1Name: string, p1Char: string, p2Type: PlayerType, p2Name: string, p2Char: string, diff: number) => {
        setPlayer1({ ...player1, name: p1Name, characterId: p1Char, score: 0 });
        setPlayer2({ ...player2, name: p2Name, type: p2Type, characterId: p2Char, score: 0 });
        setDifficulty(diff);
        setRound(1);
        setCurrentTurn('p1');
        setGameState('PLAYING');

        // To ensure fresh random state not connected to render
        const prob = generateProblem(diff);
        setCurrentProblem(prob);
        setFeedback(null);
    };

    const advanceTurn = useCallback(() => {
        setFeedback(null);

        // Note: Using functional state updates where possible to avoid dependency issues if we were to wrap this further,
        // but since we read 'currentTurn' and 'round' to make decisions, they must be deps.
        if (currentTurn === 'p2' && round >= MAX_ROUNDS) {
            setGameState('GAME_OVER');
        } else {
            if (currentTurn === 'p2') {
                setRound(prev => prev + 1);
                setCurrentTurn('p1');
            } else {
                setCurrentTurn('p2');
            }
            // We need the NEXT difficulty if it changed? No, diff is constant for game.
            // But we need to use 'difficulty' state which is in scope.
            const nextProb = generateProblem(difficulty);
            setCurrentProblem(nextProb);
        }
    }, [currentTurn, round, difficulty]);

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

        const points = isCorrect ? POINTS_PER_DIFFICULTY[difficulty as keyof typeof POINTS_PER_DIFFICULTY] : 0;

        if (currentTurn === 'p1') {
            setPlayer1(prev => ({ ...prev, score: prev.score + points }));
        } else {
            setPlayer2(prev => ({ ...prev, score: prev.score + points }));
        }

        // Auto-advance if correct OR if computer
        const isComputer = currentTurn === 'p2' && player2.type === 'computer';

        if (isCorrect || isComputer) {
            setTimeout(() => {
                // We need to call the LATEST advanceTurn.
                // Since checkAnswer depends on advanceTurn, and advanceTurn changes when state changes...
                // This closure might capture an old advanceTurn?
                // Actually checkAnswer is recreated when advanceTurn changes.
                // But setTimeout executes later.
                // It should be fine as long as the logic inside advanceTurn uses the state at that time? 
                // PRO TIP: When using setTimeout with state, refs are often better.
                // But here, advanceTurn depends on state.
                // We can just call the function.
                // However, inside the timeout, 'advanceTurn' refers to the one in THIS scope.
                // If the user clicks fast, multiple timeouts?
                // 'feedback' guard prevents re-entry.
                advanceTurn();
            }, 2000);
        }

        return { isCorrect, correctVal };
    }, [currentProblem, feedback, difficulty, currentTurn, player2.type, advanceTurn]); // removed player1/player2 object deps, used specific props if needed or just setter

    // AI Turn handling
    useEffect(() => {
        // guard feedback too
        if (gameState === 'PLAYING' && currentTurn === 'p2' && player2.type === 'computer' && currentProblem && !feedback) {
            const timer = setTimeout(() => {
                const shouldErr = shouldAIError(difficulty);
                const aiAns = generateAIAnswer(currentProblem.f1, currentProblem.f2, currentProblem.operation, difficulty, shouldErr);
                checkAnswer(aiAns);
            }, 2000 + Math.random() * 1000);
            return () => clearTimeout(timer);
        }
    }, [gameState, currentTurn, currentProblem, player2.type, difficulty, feedback, checkAnswer]);

    return {
        gameState,
        round,
        difficulty,
        player1,
        player2,
        currentTurn,
        currentProblem,
        feedback,
        startGame,
        checkAnswer,
        advanceTurn,
        resetGame: () => setGameState('MENU')
    };
};
