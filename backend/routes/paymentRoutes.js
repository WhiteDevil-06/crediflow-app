const express = require('express');
const router = express.Router();
const { recordPayment, getPaymentsByLoan } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', recordPayment);
router.get('/:loanId', getPaymentsByLoan);

module.exports = router;
