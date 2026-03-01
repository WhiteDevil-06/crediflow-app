const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ success: false, message: 'All fields are required' });

        if (password.length < 6)
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

        const existing = await User.findOne({ email });
        if (existing)
            return res.status(400).json({ success: false, message: 'Email already registered' });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, passwordHash });

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        res.status(err.name === 'ValidationError' ? 400 : 500).json({ success: false, message: err.message });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ success: false, message: 'Email and password required' });

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password)))
            return res.status(401).json({ success: false, message: 'Invalid credentials' });

        res.json({
            success: true,
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        res.status(err.name === 'ValidationError' ? 400 : 500).json({ success: false, message: err.message });
    }
};

// GET /api/auth/me
const getMe = async (req, res) => {
    res.json({ success: true, user: { id: req.user._id, name: req.user.name, email: req.user.email } });
};

module.exports = { register, login, getMe };
