const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: [true, 'Customer name is required'], trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
