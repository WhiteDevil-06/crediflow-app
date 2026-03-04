const cron = require('node-cron');
const User = require('../models/User');
const Loan = require('../models/Loan');
const { sendEmail } = require('./emailService');

const startDailyReminders = () => {
    // Run exactly at the 0th second of every single minute
    // cron pattern: minute hour dayOfMonth month dayOfWeek
    cron.schedule('* * * * *', async () => {
        try {
            // Get current internal server time formatted identically to user DB preferences (forced to IST)
            const now = new Date();

            const istTimeFormater = new Intl.DateTimeFormat('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            // Format will be "HH:MM" in 24-hour style
            const currentTimeStr = istTimeFormater.format(now);

            // Only fetch users who explicitly have alerts ON AND asked for precisely this exact minute
            const usersToNotifyRightNow = await User.find({
                'emailAlerts.enabled': true,
                'emailAlerts.time': currentTimeStr
            });

            if (usersToNotifyRightNow.length === 0) return;

            console.log(`⏰ Cron Triggered at ${currentTimeStr}! Found ${usersToNotifyRightNow.length} user(s) requesting digests right now.`);

            const next3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

            for (const user of usersToNotifyRightNow) {
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
                    console.log(`✉️ Dispatched custom digest to ${user.email} precisely at their requested time of ${currentTimeStr}.`);
                }
            }
        } catch (error) {
            console.error('❌ Error in Dynamic Cron Job:', error);
        }
    });

    console.log('🕒 Node-Cron Scheduler initialized: Polling custom user delivery times continuously.');
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
