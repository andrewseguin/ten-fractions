import { AI_ERROR_RATES } from './constants';
import { Fraction, simplifyFraction, addFractions, subtractFractions, multiplyFractions, divideFractions, compareFractions } from './fractions';

export const shouldAIError = (difficulty: number): boolean => {
    const errorRate = AI_ERROR_RATES[difficulty as keyof typeof AI_ERROR_RATES] || 0.1;
    return Math.random() < errorRate;
};

export const generateAIAnswer = (
    f1: Fraction,
    f2: Fraction,
    operation: string,
    difficulty: number,
    shouldError: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => { // Return type could be Fraction or string depending on operation

    let correctRes: Fraction | number;

    switch (operation) {
        case '+':
            correctRes = addFractions(f1, f2);
            break;
        case '-':
            correctRes = subtractFractions(f1, f2);
            break;
        case '*':
            correctRes = multiplyFractions(f1, f2);
            break;
        case '/':
            correctRes = divideFractions(f1, f2);
            break;
        case 'compare':
            correctRes = compareFractions(f1, f2); // -1, 0, 1
            break;
        default:
            throw new Error('Unknown operation');
    }

    if (!shouldError) {
        return correctRes;
    }

    // Generate a wrong answer
    if (operation === 'compare') {
        const real = correctRes as number;
        const options = [-1, 0, 1].filter(o => o !== real);
        return options[Math.floor(Math.random() * options.length)];
    } else {
        // Human-like mistakes are more common at lower levels
        const mistakeChance = difficulty === 1 ? 0.8 : 0.6;

        if (Math.random() < mistakeChance) {
            // "Adding across" - common beginner mistake
            let num = f1.numerator + (operation === '-' ? -f2.numerator : f2.numerator);
            let den = f1.denominator + (operation === '-' ? -f2.denominator : f2.denominator);

            // Basic sanity checks
            if (num <= 0) num = 1;
            if (den <= 0) den = 2;

            return simplifyFraction({ numerator: num, denominator: den });
        } else {
            // Small math error (off by one)
            const res = correctRes as Fraction;
            return {
                numerator: Math.max(1, res.numerator + (Math.random() > 0.5 ? 1 : -1)),
                denominator: res.denominator
            };
        }
    }
};
