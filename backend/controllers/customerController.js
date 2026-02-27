const Customer = require('../models/Customer');

// GET /api/customers
const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: customers });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/customers
const createCustomer = async (req, res) => {
    try {
        const { name, phone, address, notes } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Customer name is required' });

        const customer = await Customer.create({ userId: req.user._id, name, phone, address, notes });
        res.status(201).json({ success: true, data: customer });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/customers/:id
const getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, userId: req.user._id });
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
        res.json({ success: true, data: customer });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/customers/:id
const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
        res.json({ success: true, data: customer });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE /api/customers/:id
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
        res.json({ success: true, message: 'Customer deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getCustomers, createCustomer, getCustomer, updateCustomer, deleteCustomer };
