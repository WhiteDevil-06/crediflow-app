const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'], trim: true, match: [/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces'], maxlength: 60 },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
    },
    passwordHash: { type: String, required: true },
    emailAlerts: {
        enabled: { type: Boolean, default: true },
        time: { type: String, default: '08:00' } // Uses 24h string formats like 08:00, 14:00
    },
    preferences: {
        currency: { type: String, default: 'INR', enum: ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD'] }
    }
}, { timestamps: true });

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
