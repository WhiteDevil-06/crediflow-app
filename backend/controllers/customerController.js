const Customer = require('../models/Customer');
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');

// GET /api/customers
const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: customers });
    } catch (err) {
        res.status(err.name === 'ValidationError' ? 400 : 500).json({ success: false, message: err.message });
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
        res.status(err.name === 'ValidationError' ? 400 : 500).json({ success: false, message: err.message });
    }
};

// GET /api/customers/:id
const getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, userId: req.user._id });
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
        res.json({ success: true, data: customer });
    } catch (err) {
        res.status(err.name === 'ValidationError' ? 400 : 500).json({ success: false, message: err.message });
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
        res.status(err.name === 'ValidationError' ? 400 : 500).json({ success: false, message: err.message });
    }
};

// DELETE /api/customers/:id
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, userId: req.user._id });
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });

        // Step 1: Find all loans belonging to this customer
        const loans = await Loan.find({ customerId: customer._id });
        const loanIds = loans.map(loan => loan._id);

        // Step 2: Cascading Delete -> Delete all payments associated with those loans
        if (loanIds.length > 0) {
            await Payment.deleteMany({ loanId: { $in: loanIds } });
        }

        // Step 3: Cascading Delete -> Delete all the loans
        await Loan.deleteMany({ customerId: customer._id });

        // Step 4: Delete the customer
        await customer.deleteOne();

        res.json({ success: true, message: 'Customer, and all associated loans and payments deleted successfully' });
    } catch (err) {
        res.status(err.name === 'ValidationError' ? 400 : 500).json({ success: false, message: err.message });
    }
};

module.exports = { getCustomers, createCustomer, getCustomer, updateCustomer, deleteCustomer };
