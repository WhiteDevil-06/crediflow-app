const express = require('express');
const router = express.Router();
const { getLoans, createLoan, getLoan, updateLoan, deleteLoan } = require('../controllers/loanController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.use(protect);
router.route('/').get(getLoans).post(upload.single('document'), createLoan);
router.route('/:id').get(getLoan).put(updateLoan).delete(deleteLoan);

module.exports = router;
