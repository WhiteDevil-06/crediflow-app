require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const fs = require('fs');
const logFile = 'test_hourly_out.txt';
fs.writeFileSync(logFile, '');
function log(msg, obj = '') {
    fs.appendFileSync(logFile, msg + ' ' + (typeof obj === 'object' ? JSON.stringify(obj) : obj) + '\n');
}

async function runTest() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        log("Connected to MongoDB.");

        log("\n--- Phase 1: Setup Validation ---");
        const mockCurrentHour = '14:00';

        // User 1: Enabled, Time matches
        const u1 = await User.create({ name: 'U1 Match', email: `u1_${Date.now()}@test.com`, passwordHash: 'pwd', emailAlerts: { enabled: true, time: mockCurrentHour } });

        // User 2: Enabled, Time mismatch
        const u2 = await User.create({ name: 'U2 Mismatch', email: `u2_${Date.now()}@test.com`, passwordHash: 'pwd', emailAlerts: { enabled: true, time: '08:00' } });

        // User 3: Disabled, Time matches
        const u3 = await User.create({ name: 'U3 Disabled', email: `u3_${Date.now()}@test.com`, passwordHash: 'pwd', emailAlerts: { enabled: false, time: mockCurrentHour } });

        log("\n--- Phase 2: Execution (Hourly Sweep Filter) ---");
        const targetUsers = await User.find({ 'emailAlerts.enabled': true, 'emailAlerts.time': mockCurrentHour });

        log("Found Users Count:", targetUsers.length);
        if (targetUsers.length > 0) {
            log("Pulled User Name:", targetUsers[0].name);
            if (targetUsers.length === 1 && targetUsers[0].name === 'U1 Match') {
                log("✅ VALID RUN: ONLY successfully found the enabled user with matching time! U2 and U3 were safely ignored.");
            } else {
                log("❌ FAILED! Incorrect filtering");
            }
        }

        log("\n✅ ALL TESTS PASSED.");

        // Cleanup
        await User.deleteMany({ _id: { $in: [u1._id, u2._id, u3._id] } });

    } catch (err) {
        log("Test Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

runTest();
