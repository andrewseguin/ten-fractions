import { Fraction, gcd, lcm, simplifyFraction } from './fractions';

// Helper to format fraction for text explanation
const fmt = (f: Fraction) => `${f.numerator}/${f.denominator}`;

export const getStepByStep = (f1: Fraction, f2: Fraction, operation: string): string[] => {
    const steps: string[] = [];

    switch (operation) {
        case '+': {
            if (f1.denominator === f2.denominator) {
                steps.push(`Since the bottom numbers (denominators) are the same (${f1.denominator}), we just add the top numbers.`);
                steps.push(`${f1.numerator} + ${f2.numerator} = ${f1.numerator + f2.numerator}`);
                steps.push(`So the answer is ${f1.numerator + f2.numerator}/${f1.denominator}`);
            } else {
                const common = lcm(f1.denominator, f2.denominator);
                steps.push(`First, find a common denominator for ${f1.denominator} and ${f2.denominator}. The easiest one is ${common}.`);

                const m1 = common / f1.denominator;
                const m2 = common / f2.denominator;

                steps.push(`Multiply the first fraction by ${m1} so the bottom becomes ${common}: ${f1.numerator}×${m1} / ${f1.denominator}×${m1} = ${f1.numerator * m1}/${common}.`);
                steps.push(`Multiply the second fraction by ${m2} so the bottom becomes ${common}: ${f2.numerator}×${m2} / ${f2.denominator}×${m2} = ${f2.numerator * m2}/${common}.`);
                steps.push(`Now add the tops: ${f1.numerator * m1} + ${f2.numerator * m2} = ${(f1.numerator * m1) + (f2.numerator * m2)}.`);
                steps.push(`The result is ${(f1.numerator * m1) + (f2.numerator * m2)}/${common}.`);
            }
            break;
        }
        case '-': {
            if (f1.denominator === f2.denominator) {
                steps.push(`Since the bottom numbers are the same (${f1.denominator}), just subtract the tops.`);
                steps.push(`${f1.numerator} - ${f2.numerator} = ${f1.numerator - f2.numerator}`);
                steps.push(`So the answer is ${f1.numerator - f2.numerator}/${f1.denominator}`);
            } else {
                const common = lcm(f1.denominator, f2.denominator);
                steps.push(`Find the common denominator for ${f1.denominator} and ${f2.denominator}, which is ${common}.`);

                const m1 = common / f1.denominator;
                const m2 = common / f2.denominator;

                steps.push(`Convert ${fmt(f1)} to ${f1.numerator * m1}/${common}.`);
                steps.push(`Convert ${fmt(f2)} to ${f2.numerator * m2}/${common}.`);
                steps.push(`Subtract the tops: ${f1.numerator * m1} - ${f2.numerator * m2} = ${(f1.numerator * m1) - (f2.numerator * m2)}.`);
                steps.push(`The result is ${(f1.numerator * m1) - (f2.numerator * m2)}/${common}.`);
            }
            break;
        }
        case '*': {
            steps.push('To multiply fractions, multiply the tops together and the bottoms together.');
            steps.push(`Tops: ${f1.numerator} × ${f2.numerator} = ${f1.numerator * f2.numerator}`);
            steps.push(`Bottoms: ${f1.denominator} × ${f2.denominator} = ${f1.denominator * f2.denominator}`);
            steps.push(`So the answer is ${f1.numerator * f2.numerator}/${f1.denominator * f2.denominator}`);
            break;
        }
        case '/': {
            steps.push('To divide, flip the second fraction upside down and multiply.');
            steps.push(`Flip ${fmt(f2)} to make it ${f2.denominator}/${f2.numerator}.`);
            steps.push(`Now multiply: ${fmt(f1)} × ${f2.denominator}/${f2.numerator}.`);
            steps.push(`Tops: ${f1.numerator} × ${f2.denominator} = ${f1.numerator * f2.denominator}`);
            steps.push(`Bottoms: ${f1.denominator} × ${f2.numerator} = ${f1.denominator * f2.numerator}`);
            steps.push(`So the answer is ${f1.numerator * f2.denominator}/${f1.denominator * f2.numerator}`);
            break;
        }
        case 'compare': {
            const v1 = f1.numerator / f1.denominator;
            const v2 = f2.numerator / f2.denominator;

            steps.push('To compare, we can cross-multiply.');
            steps.push(`${f1.numerator} × ${f2.denominator} = ${f1.numerator * f2.denominator}`);
            steps.push(`${f2.numerator} × ${f1.denominator} = ${f2.numerator * f1.denominator}`);

            if (v1 === v2) {
                steps.push('Since both sides are equal, the fractions are equal!');
            } else if (v1 > v2) {
                steps.push(`Since ${f1.numerator * f2.denominator} is bigger than ${f2.numerator * f1.denominator}, ${fmt(f1)} is bigger.`);
            } else {
                steps.push(`Since ${f2.numerator * f1.denominator} is bigger than ${f1.numerator * f2.denominator}, ${fmt(f2)} is bigger.`);
            }
            break;
        }
    }

    // Check simplification
    if (operation === '*') {
        const rawNum = f1.numerator * f2.numerator;
        const rawDenom = f1.denominator * f2.denominator;
        const simple = simplifyFraction({ numerator: rawNum, denominator: rawDenom });
        if (simple.denominator !== rawDenom && simple.denominator !== 0) {
            steps.push(`Finally, we can simplify ${rawNum}/${rawDenom} by dividing top and bottom by ${gcd(rawNum, rawDenom)}.`);
            steps.push(`Final Answer: ${simple.numerator}/${simple.denominator}`);
        }
    }

    return steps;
};
