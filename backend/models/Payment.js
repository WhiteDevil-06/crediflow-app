const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: { type: String, enum: ['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'OTHER'], default: 'CASH' },
    notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
