import { useState, useEffect, useCallback, useRef } from 'react';
import { MAX_ROUNDS, POINTS_PER_DIFFICULTY, PlayerType } from '@/lib/constants';
import { generateProblem, compareFractions, Fraction, addFractions, subtractFractions, multiplyFractions, divideFractions } from '@/lib/fractions';
import { generateAIAnswer, shouldAIError } from '@/lib/ai';
import { getStepByStep, getInstructions, getAlternativeExplanation } from '@/lib/steps';

export type GameState = 'MENU' | 'PLAYING' | 'GAME_OVER' | 'MINI_GAME';

export type Player = {
    id: string;
    name: string;
    type: PlayerType;
    score: number;
    characterId: string;
    elevation: number; // For Mountain Mode
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

    const [player1, setPlayer1] = useState<Player>({ id: 'p1', name: 'Player 1', type: 'human', score: 0, characterId: 'hero1', elevation: 0 });
    const [player2, setPlayer2] = useState<Player>({ id: 'p2', name: 'Computer', type: 'computer', score: 0, characterId: 'hero2', elevation: 0 });

    const [currentTurn, setCurrentTurn] = useState<'p1' | 'p2'>('p1');
    const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
    const [isThinking, setIsThinking] = useState(false);

    const [isSpeedRound, setIsSpeedRound] = useState(false);
    const [timeLeft, setTimeLeft] = useState(20);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [isMountainMode, setIsMountainMode] = useState(false);
    const [practiceOperation, setPracticeOperation] = useState<string | null>(null);
    const [isPracticeMode, setIsPracticeMode] = useState(false);
    const [visibleStepCount, setVisibleStepCount] = useState(0);
    const [assessmentResult, setAssessmentResult] = useState<'right' | 'wrong' | null>(null);
    const [userReflectedAnswer, setUserReflectedAnswer] = useState('');
    const [isAlternativeMode, setIsAlternativeMode] = useState(false);
    const [isHintThinking, setIsHintThinking] = useState(false);
    const [hintTimeLeft, setHintTimeLeft] = useState(0);

    // Reward Mini-game state
    const [p1CorrectSessionCount, setP1CorrectSessionCount] = useState(0);
    const [showMiniGameOffer, setShowMiniGameOffer] = useState(false);
    const [miniGamePoints, setMiniGamePoints] = useState(0);
    const [isDirectMiniGame, setIsDirectMiniGame] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctVal: any; steps?: string[]; isTimeout?: boolean } | null>(null);

    const instructions = currentProblem && isPracticeMode
        ? (isAlternativeMode
            ? getAlternativeExplanation(currentProblem.f1, currentProblem.f2, currentProblem.operation)
            : getInstructions(currentProblem.f1, currentProblem.f2, currentProblem.operation))
        : [];

    const showNextStep = useCallback(() => {
        if (isHintThinking || visibleStepCount >= instructions.length) return;

        setIsHintThinking(true);
        setHintTimeLeft(5);

        const timer = setInterval(() => {
            setHintTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setVisibleStepCount(v => Math.min(v + 1, instructions.length));
                    setIsHintThinking(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [instructions.length, isHintThinking, visibleStepCount]);
    const startGame = (p1Name: string, p1Char: string, p2Type: PlayerType, p2Name: string, p2Char: string, diff: number, bgId?: string, specOp?: string) => {
        const mountainMode = bgId === 'mountain';
        setIsMountainMode(mountainMode);
        setPracticeOperation(specOp || null);
        setIsPracticeMode(!!specOp);
        setVisibleStepCount(0);
        setAssessmentResult(null);
        setUserReflectedAnswer('');
        setIsAlternativeMode(false);
        setIsHintThinking(false);
        setHintTimeLeft(0);

        setPlayer1({ id: 'p1', name: p1Name, characterId: p1Char, score: 0, elevation: 0, type: 'human' });
        setPlayer2({ id: 'p2', name: p2Name, type: p2Type, characterId: p2Char, score: 0, elevation: 0 });

        setDifficulty(mountainMode ? 1 : diff); // Mountain mode starts at ease and scales
        setRound(1);
        setCurrentTurn('p1');
        setGameState('PLAYING');
        setIsSpeedRound(false);
        setTimeLeft(20);

        const prob = generateProblem(mountainMode ? 1 : diff, specOp);
        setCurrentProblem(prob);
        setFeedback(null);
        setIsThinking(false);
        setP1CorrectSessionCount(0);
        setShowMiniGameOffer(false);
        setMiniGamePoints(0);
        setIsDirectMiniGame(false);
    };

    const advanceTurn = useCallback(() => {
        setFeedback(null);
        setVisibleStepCount(0);
        setAssessmentResult(null);
        setUserReflectedAnswer('');
        setIsAlternativeMode(false);

        const nextTurn = isPracticeMode ? 'p1' : (currentTurn === 'p1' ? 'p2' : 'p1');

        if (currentTurn === 'p2' && round >= MAX_ROUNDS && !isMountainMode) {
            if (!isSpeedRound) {
                setIsSpeedRound(true);
                setRound(11);
                setCurrentTurn('p1');
                setTimeLeft(20);
                const nextProb = generateProblem(difficulty, practiceOperation || undefined);
                setCurrentProblem(nextProb);
                setIsThinking(false);
            } else if (round >= MAX_ROUNDS + 5) {
                setGameState('GAME_OVER');
                setIsThinking(false);
            } else {
                setRound(prev => prev + 1);
                setCurrentTurn('p1');
                setTimeLeft(20);
                const nextProb = generateProblem(difficulty, practiceOperation || undefined);
                setCurrentProblem(nextProb);
            }
        } else if (isMountainMode && round >= MAX_ROUNDS + 10) { // Mountain mode lasts 20 rounds
            setGameState('GAME_OVER');
            setIsThinking(false);
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

            const nextProb = generateProblem(difficulty, practiceOperation || undefined);
            setCurrentProblem(nextProb);
        }
    }, [currentTurn, round, difficulty, player2.type, isSpeedRound, isMountainMode, practiceOperation, isPracticeMode]);

    const handleTimeout = useCallback(() => {
        if (!currentProblem || feedback || (!isSpeedRound && !isMountainMode)) return;

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

        // In Mountain Mode, timeout moves you down
        if (isMountainMode) {
            if (currentTurn === 'p1') {
                setPlayer1(prev => ({ ...prev, elevation: Math.max(0, prev.elevation - 10) }));
            } else {
                setPlayer2(prev => ({ ...prev, elevation: Math.max(0, prev.elevation - 10) }));
            }
        }

        setTimeout(() => {
            advanceTurn();
        }, 3000);
    }, [currentProblem, feedback, isSpeedRound, isMountainMode, currentTurn, advanceTurn]);

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
            setPlayer1(prev => {
                const newElevation = isMountainMode ? (isCorrect ? prev.elevation + 10 : Math.max(0, prev.elevation - 10)) : 0;
                return { ...prev, score: prev.score + points, elevation: newElevation };
            });
        } else {
            setPlayer2(prev => {
                const newElevation = isMountainMode ? (isCorrect ? prev.elevation + 10 : Math.max(0, prev.elevation - 10)) : 0;
                return { ...prev, score: prev.score + points, elevation: newElevation };
            });
        }

        // Difficulty scaling for Mountain Mode
        if (isMountainMode) {
            const maxElevation = Math.max(player1.elevation, player2.elevation);
            if (maxElevation > 60) setDifficulty(3);
            else if (maxElevation > 30) setDifficulty(2);
            else setDifficulty(1);
        }

        const isComputer = currentTurn === 'p2' && player2.type === 'computer';

        if (isCorrect || isComputer) {
            if (isCorrect && currentTurn === 'p1' && !isPracticeMode) {
                const nextCount = p1CorrectSessionCount + 1;
                setP1CorrectSessionCount(nextCount);
                if (nextCount >= 2) {
                    setShowMiniGameOffer(true);
                }
            }

            if (!isPracticeMode) {
                setTimeout(() => {
                    if (p1CorrectSessionCount + 1 < 2 || currentTurn !== 'p1') {
                        advanceTurn();
                    }
                }, 3000);
            }
        }

        return { isCorrect, correctVal };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProblem, feedback, difficulty, currentTurn, player2.type, advanceTurn, isSpeedRound, isMountainMode, player1.elevation, player2.elevation]);

    useEffect(() => {
        // Timer for Speed Round OR Mountain Round (20s)
        if (gameState === 'PLAYING' && (isSpeedRound || isMountainMode) && !feedback && !isThinking) {
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
    }, [gameState, isSpeedRound, isMountainMode, feedback, isThinking, handleTimeout]);

    useEffect(() => {
        if (gameState === 'PLAYING' && currentTurn === 'p2' && player2.type === 'computer' && currentProblem && !feedback && isThinking) {
            const thinkingTime = (isSpeedRound || isMountainMode)
                ? 1000 + Math.random() * 500
                : 1200 + Math.random() * 1000;

            const timer = setTimeout(() => {
                const shouldErr = shouldAIError(difficulty);
                const aiAns = generateAIAnswer(currentProblem.f1, currentProblem.f2, currentProblem.operation, difficulty, shouldErr);
                setIsThinking(false);
                checkAnswer(aiAns);
            }, thinkingTime);

            return () => clearTimeout(timer);
        }
    }, [gameState, currentTurn, currentProblem, player2.type, difficulty, feedback, isThinking, checkAnswer, isSpeedRound, isMountainMode]);

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
        isMountainMode,
        isPracticeMode,
        instructions,
        visibleStepCount,
        setVisibleStepCount,
        showNextStep,
        assessmentResult,
        setAssessmentResult,
        userReflectedAnswer,
        setUserReflectedAnswer,
        isAlternativeMode,
        setIsAlternativeMode,
        isHintThinking,
        hintTimeLeft,
        showMiniGameOffer,
        setShowMiniGameOffer,
        startMiniGame: () => {
            setShowMiniGameOffer(false);
            setIsDirectMiniGame(false);
            setGameState('MINI_GAME');
        },
        resolveMiniGame: (points: number) => {
            setPlayer1(prev => ({ ...prev, score: prev.score + points }));
            setMiniGamePoints(points);
            setP1CorrectSessionCount(0);
            if (isDirectMiniGame) {
                setGameState('MENU');
            } else {
                setGameState('PLAYING');
                advanceTurn();
            }
        },
        skipMiniGame: () => {
            setShowMiniGameOffer(false);
            setP1CorrectSessionCount(0);
            advanceTurn();
        },
        miniGamePoints,
        timeLeft,
        startGame,
        checkAnswer,
        advanceTurn,
        skipToHardRound: () => {
            setDifficulty(3);
            setIsSpeedRound(true);
            setRound(MAX_ROUNDS + 1);
            setCurrentTurn('p1');
            setTimeLeft(20);
            const nextProb = generateProblem(3);
            setCurrentProblem(nextProb);
            setFeedback(null);
            setIsThinking(false);
        },
        startMiniGameDirectly: (p1Char: string) => {
            setPlayer1(prev => ({ ...prev, characterId: p1Char }));
            setIsDirectMiniGame(true);
            setGameState('MINI_GAME');
        },
        resetGame: () => setGameState('MENU')
    };
};
