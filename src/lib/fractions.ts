export type Fraction = {
    numerator: number;
    denominator: number;
};

// Greatest Common Divisor
export const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
};

// Least Common Multiple
export const lcm = (a: number, b: number): number => {
    return (a * b) / gcd(a, b);
};

export const simplifyFraction = (f: Fraction): Fraction => {
    const common = gcd(Math.abs(f.numerator), Math.abs(f.denominator));
    return {
        numerator: f.numerator / common,
        denominator: f.denominator / common,
    };
};

export const addFractions = (f1: Fraction, f2: Fraction): Fraction => {
    const commonDenominator = lcm(f1.denominator, f2.denominator);
    const num1 = f1.numerator * (commonDenominator / f1.denominator);
    const num2 = f2.numerator * (commonDenominator / f2.denominator);
    return simplifyFraction({
        numerator: num1 + num2,
        denominator: commonDenominator,
    });
};

export const subtractFractions = (f1: Fraction, f2: Fraction): Fraction => {
    const commonDenominator = lcm(f1.denominator, f2.denominator);
    const num1 = f1.numerator * (commonDenominator / f1.denominator);
    const num2 = f2.numerator * (commonDenominator / f2.denominator);
    return simplifyFraction({
        numerator: num1 - num2,
        denominator: commonDenominator,
    });
};

export const multiplyFractions = (f1: Fraction, f2: Fraction): Fraction => {
    return simplifyFraction({
        numerator: f1.numerator * f2.numerator,
        denominator: f1.denominator * f2.denominator,
    });
};

export const divideFractions = (f1: Fraction, f2: Fraction): Fraction => {
    return simplifyFraction({
        numerator: f1.numerator * f2.denominator,
        denominator: f1.denominator * f2.numerator,
    });
};

export const compareFractions = (f1: Fraction, f2: Fraction): number => {
    const v1 = f1.numerator / f1.denominator;
    const v2 = f2.numerator / f2.denominator;
    if (v1 < v2) return -1;
    if (v1 > v2) return 1;
    return 0;
};

export const formatFraction = (f: Fraction): string => {
    if (f.denominator === 1) return `${f.numerator}`;
    if (f.numerator === 0) return '0';
    return `${f.numerator}/${f.denominator}`;
};

// Difficulty levels: 1 (easy) to 3 (hard)
export const generateFraction = (difficulty: number): Fraction => {
    let maxDenom = 5;
    if (difficulty === 2) maxDenom = 10;
    if (difficulty === 3) maxDenom = 20;

    const denominator = Math.floor(Math.random() * (maxDenom - 1)) + 2; // 2 to maxDenom
    const numerator = Math.floor(Math.random() * (denominator * 2)) + 1; // Allow improper fractions

    return simplifyFraction({ numerator, denominator });
};

export const generateProblem = (difficulty: number) => {
    const operations = ['+', '-', '*', '/', 'compare'] as const;
    const operation = operations[Math.floor(Math.random() * operations.length)];

    const d1 = difficulty;
    const d2 = difficulty;

    // if (difficulty === 1) { ... }

    const f1 = generateFraction(d1);
    const f2 = generateFraction(d2);

    // Avoid negative result for level 1 subtraction
    if (operation === '-' && difficulty === 1) {
        if (compareFractions(f1, f2) < 0) {
            return { f1: f2, f2: f1, operation }; // Swap
        }
    }

    return { f1, f2, operation };
};
