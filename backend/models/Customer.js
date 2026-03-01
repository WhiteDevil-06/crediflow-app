const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: [true, 'Customer name is required'], trim: true, match: [/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces'] },
    phone: { type: String, trim: true, match: [/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'] },
    address: { type: String, trim: true },
    notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
