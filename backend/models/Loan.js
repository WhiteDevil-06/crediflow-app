const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    loanType: { type: String, enum: ['GIVEN', 'TAKEN'], required: true },
    principalAmount: { type: Number, required: true, min: [1, 'Principal amount must be greater than 0'] },
    interestRate: { type: Number, required: true, min: [0.01, 'Interest rate cannot be negative or zero'] }, // % per month or per year
    interestType: { type: String, enum: ['SIMPLE', 'COMPOUND'], default: 'SIMPLE' },
    interestFrequency: { type: String, enum: ['MONTHLY', 'YEARLY'], default: 'MONTHLY' },
    startDate: { type: Date, required: true },
    durationMonths: { type: Number, required: true, min: [1, 'Duration must be at least 1 month'] },
    // Auto-calculated
    monthlyInterest: { type: Number },
    totalInterest: { type: Number },
    totalAmount: { type: Number },
    remainingBalance: { type: Number },
    // Extras
    documentUrl: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'OVERDUE'], default: 'ACTIVE' },
}, { timestamps: true });

module.exports = mongoose.model('Loan', LoanSchema);
