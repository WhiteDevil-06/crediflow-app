export function calcLoanTotals(principal, rate, duration, durationUnit, interestType, interestFrequency) {
    if (!principal || !rate || !duration) return null;
    const P = Number(principal);
    const r = Number(rate);
    const t = durationUnit === 'YEARS' ? Number(duration) * 12 : Number(duration);
    if (P <= 0 || r <= 0 || t <= 0) return null;

    const mr = interestFrequency === 'YEARLY' ? r / 12 / 100 : r / 100;
    const totalAmount = interestType === 'SIMPLE' ? P * (1 + mr * t) : P * Math.pow(1 + mr, t);
    const totalInterest = totalAmount - P;

    return {
        P,
        t,
        mr,
        totalAmount,
        totalInterest,
        monthlyPayment: totalAmount / t,
        monthlyPrincipal: P / t,
        monthlyInterest: totalInterest / t
    };
}

export function generateAmortizationSchedule(principal, rate, duration, durationUnit, interestType, interestFrequency, startDate) {
    const totals = calcLoanTotals(principal, rate, duration, durationUnit, interestType, interestFrequency);
    if (!totals || !startDate) return null;

    const schedule = [];
    let currentBalance = totals.totalAmount;
    let currentDate = new Date(startDate);

    for (let i = 1; i <= totals.t; i++) {
        // Increment month safely
        currentDate.setMonth(currentDate.getMonth() + 1);

        currentBalance -= totals.monthlyPayment;

        schedule.push({
            month: i,
            date: new Date(currentDate).toISOString(),
            payment: totals.monthlyPayment,
            principalPaid: totals.monthlyPrincipal,
            interestPaid: totals.monthlyInterest,
            remainingBalance: Math.max(0, currentBalance)
        });
    }

    return schedule;
}
