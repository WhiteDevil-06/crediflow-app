/**
 * Interest Calculator Utility
 * Calculates monthly interest, total interest, and total payable amount.
 *
 * @param {number} principal
 * @param {number} rate - % rate
 * @param {number} durationMonths
 * @param {'SIMPLE'|'COMPOUND'} interestType
 * @param {'MONTHLY'|'YEARLY'} interestFrequency
 */
const calculateInterest = (principal, rate, durationMonths, interestType, interestFrequency) => {
    // Convert rate to monthly decimal
    const monthlyRate = interestFrequency === 'YEARLY' ? rate / 12 / 100 : rate / 100;
    const t = durationMonths;

    let totalAmount;

    if (interestType === 'SIMPLE') {
        // Simple Interest: A = P(1 + r*t)
        totalAmount = principal * (1 + monthlyRate * t);
    } else {
        // Compound Interest: A = P(1 + r)^t
        totalAmount = principal * Math.pow(1 + monthlyRate, t);
    }

    const totalInterest = totalAmount - principal;
    const monthlyInterest = totalInterest / t;

    return {
        monthlyInterest: parseFloat(monthlyInterest.toFixed(2)),
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        totalAmount: parseFloat(totalAmount.toFixed(2)),
    };
};

module.exports = { calculateInterest };
