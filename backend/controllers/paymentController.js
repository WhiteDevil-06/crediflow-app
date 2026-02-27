const Payment = require('../models/Payment');
const Loan = require('../models/Loan');

// POST /api/payments
const recordPayment = async (req, res) => {
    try {
        const { loanId, amount, paymentDate, paymentMethod, notes } = req.body;

        if (!loanId || !amount)
            return res.status(400).json({ success: false, message: 'loanId and amount are required' });

        const loan = await Loan.findOne({ _id: loanId, userId: req.user._id });
        if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });

        const payment = await Payment.create({
            userId: req.user._id,
            loanId,
            amount: Number(amount),
            paymentDate: paymentDate || Date.now(),
            paymentMethod: paymentMethod || 'CASH',
            notes,
        });

        // Update remaining balance
        loan.remainingBalance = Math.max(0, loan.remainingBalance - Number(amount));
        if (loan.remainingBalance <= 0) {
            loan.status = 'COMPLETED';
        }
        await loan.save();

        res.status(201).json({ success: true, data: payment, remainingBalance: loan.remainingBalance, loanStatus: loan.status });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/payments/:loanId
const getPaymentsByLoan = async (req, res) => {
    try {
        const payments = await Payment.find({ loanId: req.params.loanId, userId: req.user._id })
            .sort({ paymentDate: -1 });
        res.json({ success: true, data: payments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { recordPayment, getPaymentsByLoan };
