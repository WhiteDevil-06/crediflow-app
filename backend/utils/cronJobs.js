const cron = require('node-cron');
const User = require('../models/User');
const Loan = require('../models/Loan');
const { sendEmail } = require('./emailService');

const startDailyReminders = () => {
    // Run every day at 08:00 AM server time
    // cron pattern: minute hour dayOfMonth month dayOfWeek
    cron.schedule('0 8 * * *', async () => {
        console.log('⏰ Running Daily Cron Job: Checking for Due / Overdue Loans...');
        try {
            const users = await User.find();
            const now = new Date();
            const next3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

            for (const user of users) {
                // Find all active/overdue loans for this user
                const loans = await Loan.find({ userId: user._id, status: { $in: ['ACTIVE', 'OVERDUE'] } })
                    .populate('customerId', 'name');

                let upcoming = [];
                let overdue = [];

                for (const loan of loans) {
                    const dueDate = new Date(loan.startDate);
                    dueDate.setMonth(dueDate.getMonth() + loan.durationMonths);

                    if (loan.status === 'OVERDUE') {
                        overdue.push({ loan, dueDate });
                    } else if (loan.status === 'ACTIVE' && dueDate <= next3Days) {
                        upcoming.push({ loan, dueDate });
                    }
                }

                if (upcoming.length > 0 || overdue.length > 0) {
                    const htmlContent = buildEmailHTML(user.name, upcoming, overdue);
                    await sendEmail(user.email, 'CrediFlow Daily Payment Digest', htmlContent);
                }
            }
            console.log('✅ Daily Cron Job Completed successfully.');
        } catch (error) {
            console.error('❌ Error in Daily Cron Job:', error);
        }
    });

    console.log('🕒 Node-Cron Scheduler initialized: Daily Reminders set for 08:00 AM');
};

const buildEmailHTML = (userName, upcoming, overdue) => {
    let html = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #2563eb; color: #fff; padding: 20px; text-align: center;">
                <h2>CrediFlow Daily Digest</h2>
            </div>
            <div style="padding: 20px;">
                <p>Hello <b>${userName}</b>,</p>
                <p>Here is your daily summary of payments that require your attention.</p>
    `;

    if (overdue.length > 0) {
        html += `<h3 style="color: #dc2626;">🚨 Overdue Payments</h3><ul>`;
        for (const item of overdue) {
            html += `<li><b>${item.loan.customerId?.name || 'Unknown'}</b> owes <b>₹${item.loan.remainingBalance}</b> (Due: ${item.dueDate.toLocaleDateString()})</li>`;
        }
        html += `</ul>`;
    }

    if (upcoming.length > 0) {
        html += `<h3 style="color: #d97706;">🔔 Upcoming Payments (Next 3 Days)</h3><ul>`;
        for (const item of upcoming) {
            html += `<li><b>${item.loan.customerId?.name || 'Unknown'}</b> owes <b>₹${item.loan.remainingBalance}</b> (Due: ${item.dueDate.toLocaleDateString()})</li>`;
        }
        html += `</ul>`;
    }

    html += `
                <p style="margin-top: 20px;">Please login to your CrediFlow dashboard to manage these accounts.</p>
            </div>
            <div style="background-color: #f3f4f6; color: #6b7280; padding: 10px; text-align: center; font-size: 12px;">
                <p>This is an automated message from CrediFlow.</p>
            </div>
        </div>
    `;
    return html;
};

module.exports = { startDailyReminders };
