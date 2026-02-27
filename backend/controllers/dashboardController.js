const Loan = require('../models/Loan');
const Payment = require('../models/Payment');

// GET /api/dashboard/summary
const getSummary = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const loans = await Loan.find({ userId }).populate('customerId', 'name phone');

        let totalLent = 0, totalBorrowed = 0, totalInterestEarned = 0, totalOutstanding = 0;
        const upcomingPayments = [];
        const overduePayments = [];

        for (const loan of loans) {
            const dueDate = new Date(loan.startDate);
            dueDate.setMonth(dueDate.getMonth() + loan.durationMonths);

            if (loan.loanType === 'GIVEN') {
                totalLent += loan.principalAmount;
                if (loan.status === 'COMPLETED') totalInterestEarned += loan.totalInterest;
                else totalOutstanding += loan.remainingBalance;
            } else {
                totalBorrowed += loan.principalAmount;
            }

            // Auto overdue check
            if (loan.status === 'ACTIVE' && now > dueDate) {
                loan.status = 'OVERDUE';
                await loan.save();
            }

            if (loan.status === 'OVERDUE') overduePayments.push(loan);
            else if (loan.status === 'ACTIVE' && dueDate <= next7Days) upcomingPayments.push(loan);
        }

        // Recent 5 payments
        const recentTransactions = await Payment.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('loanId', 'loanType principalAmount');

        res.json({
            success: true,
            data: {
                totalLent,
                totalBorrowed,
                totalInterestEarned,
                totalOutstanding,
                totalLoans: loans.length,
                activeLoans: loans.filter(l => l.status === 'ACTIVE').length,
                overdueCount: overduePayments.length,
                upcomingPayments,
                overduePayments,
                recentTransactions,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getSummary };
