const Loan = require('../models/Loan');
const { calculateInterest } = require('../utils/interestCalculator');

// GET /api/loans
const getLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ userId: req.user._id })
            .populate('customerId', 'name phone')
            .sort({ createdAt: -1 });

        // Auto-update overdue status
        const now = new Date();
        for (const loan of loans) {
            if (loan.status === 'ACTIVE') {
                const dueDate = new Date(loan.startDate);
                dueDate.setMonth(dueDate.getMonth() + loan.durationMonths);
                if (now > dueDate) {
                    loan.status = 'OVERDUE';
                    await loan.save();
                }
            }
        }

        res.json({ success: true, data: loans });
    } catch (err) {
        res.status(err.name === 'ValidationError' ? 400 : 500).json({ success: false, message: err.message });
    }
};

// POST /api/loans
const createLoan = async (req, res) => {
    try {
        const {
            customerId, loanType, principalAmount, interestRate,
            interestType, interestFrequency, startDate, durationMonths, notes,
        } = req.body;

        if (!customerId || !loanType || !principalAmount || !interestRate || !startDate || !durationMonths)
            return res.status(400).json({ success: false, message: 'All required fields must be provided' });

        const { monthlyInterest, totalInterest, totalAmount } = calculateInterest(
            Number(principalAmount),
            Number(interestRate),
            Number(durationMonths),
            interestType || 'SIMPLE',
            interestFrequency || 'MONTHLY'
        );

        const documentUrl = req.file ? req.file.path : undefined;

        const loan = await Loan.create({
            userId: req.user._id,
            customerId, loanType,
            principalAmount: Number(principalAmount),
            interestRate: Number(interestRate),
            interestType: interestType || 'SIMPLE',
            interestFrequency: interestFrequency || 'MONTHLY',
            startDate,
            durationMonths: Number(durationMonths),
            monthlyInterest,
            totalInterest,
            totalAmount,
            remainingBalance: totalAmount,
            documentUrl,
            notes,
        });

        await loan.populate('customerId', 'name phone');
        res.status(201).json({ success: true, data: loan });
    } catch (err) {
        res.status(err.name === 'ValidationError' ? 400 : 500).json({ success: false, message: err.message });
    }
};

// GET /api/loans/:id
const getLoan = async (req, res) => {
    try {
        const loan = await Loan.findOne({ _id: req.params.id, userId: req.user._id })
            .populate('customerId', 'name phone address');
        if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });
        res.json({ success: true, data: loan });
    } catch (err) {
        res.status(err.name === 'ValidationError' ? 400 : 500).json({ success: false, message: err.message });
    }
};

// PUT /api/loans/:id
const updateLoan = async (req, res) => {
    try {
        const loan = await Loan.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });
        res.json({ success: true, data: loan });
    } catch (err) {
        res.status(err.name === 'ValidationError' ? 400 : 500).json({ success: false, message: err.message });
    }
};

// DELETE /api/loans/:id
const deleteLoan = async (req, res) => {
    try {
        const loan = await Loan.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });
        res.json({ success: true, message: 'Loan deleted' });
    } catch (err) {
        res.status(err.name === 'ValidationError' ? 400 : 500).json({ success: false, message: err.message });
    }
};

module.exports = { getLoans, createLoan, getLoan, updateLoan, deleteLoan };
