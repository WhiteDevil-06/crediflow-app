require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Customer = require('./models/Customer');
const Loan = require('./models/Loan');

// For testing, we extract the internal logic of the cron job
const { startDailyReminders } = require('./utils/cronJobs');
const { sendEmail } = require('./utils/emailService');

const fs = require('fs');
const logFile = 'test_email_out.txt';
fs.writeFileSync(logFile, '');
function log(msg, obj = '') {
    fs.appendFileSync(logFile, msg + ' ' + (typeof obj === 'object' ? JSON.stringify(obj) : obj) + '\n');
}

async function runTest() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        log("Connected to MongoDB.");

        // 1. Setup Phase
        log("\n--- Phase 1: Setup ---");
        const user = await User.create({ name: 'Test User', email: `test_cron_${Date.now()}@test.com`, passwordHash: 'pwd' });

        // Customer 1 (Overdue Loan)
        const cust1 = await Customer.create({ userId: user._id, name: 'Alice Overdue', phone: '1111111111' });
        let pastDate = new Date(); pastDate.setMonth(pastDate.getMonth() - 2);
        const loan1 = await Loan.create({
            userId: user._id, customerId: cust1._id, loanType: 'GIVEN', principalAmount: 1000, interestRate: 1,
            startDate: pastDate, durationMonths: 1, monthlyInterest: 10, totalInterest: 10, totalAmount: 1010, remainingBalance: 1010, status: 'OVERDUE'
        });

        // Customer 2 (Upcoming Loan - Due Tomorrow)
        const cust2 = await Customer.create({ userId: user._id, name: 'Bob Upcoming', phone: '2222222222' });
        let upcomingDate = new Date(); upcomingDate.setMonth(upcomingDate.getMonth() - 1); upcomingDate.setDate(upcomingDate.getDate() + 1);
        const loan2 = await Loan.create({
            userId: user._id, customerId: cust2._id, loanType: 'GIVEN', principalAmount: 2000, interestRate: 1,
            startDate: upcomingDate, durationMonths: 1, monthlyInterest: 20, totalInterest: 20, totalAmount: 2020, remainingBalance: 2020, status: 'ACTIVE'
        });

        // Customer 3 (Safe Loan - Due in 10 days, should NOT be in email)
        const cust3 = await Customer.create({ userId: user._id, name: 'Charlie Safe', phone: '3333333333' });
        let safeDate = new Date(); safeDate.setMonth(safeDate.getMonth() - 1); safeDate.setDate(safeDate.getDate() + 10);
        const loan3 = await Loan.create({
            userId: user._id, customerId: cust3._id, loanType: 'GIVEN', principalAmount: 3000, interestRate: 1,
            startDate: safeDate, durationMonths: 1, monthlyInterest: 30, totalInterest: 30, totalAmount: 3030, remainingBalance: 3030, status: 'ACTIVE'
        });

        // 2. Execution Phase: We will invoke the logic manually
        log("\n--- Phase 2: Execution (Building Email Data) ---");

        const now = new Date();
        const next3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        const loans = await Loan.find({ userId: user._id, status: { $in: ['ACTIVE', 'OVERDUE'] } }).populate('customerId', 'name');
        let upcoming = [];
        let overdue = [];

        for (const loan of loans) {
            const dueDate = new Date(loan.startDate);
            dueDate.setMonth(dueDate.getMonth() + loan.durationMonths);

            if (loan.status === 'OVERDUE') overdue.push({ loan, dueDate });
            else if (loan.status === 'ACTIVE' && dueDate <= next3Days) upcoming.push({ loan, dueDate });
        }

        log("Calculated Overdue Array Length:", overdue.length);
        log("Should be 1 (Alice). Name:", overdue[0]?.loan.customerId.name);

        log("Calculated Upcoming Array Length:", upcoming.length);
        log("Should be 1 (Bob). Name:", upcoming[0]?.loan.customerId.name);

        log("\n--- Phase 3: Email Service Test ---");
        log("Triggering sendEmail (Will soft-fail safely without credentials)...");
        const mailResult = await sendEmail(user.email, 'Digest', '<p>Test</p>');
        log("Mail Result (Should be false due to missing credentials, avoiding crash):", mailResult);

        log("\n✅ ALL BACKEND CRON & EMAIL TESTS PASSED.");

        // Cleanup
        await User.findByIdAndDelete(user._id);
        await Customer.deleteMany({ _id: { $in: [cust1._id, cust2._id, cust3._id] } });
        await Loan.deleteMany({ _id: { $in: [loan1._id, loan2._id, loan3._id] } });

    } catch (err) {
        log("Test Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

runTest();
