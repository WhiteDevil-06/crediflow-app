require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testUpdate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected");

        // Create a user
        const user = await User.create({ name: 'Test', email: `test_${Date.now()}@test.com`, passwordHash: 'pwd' });
        console.log("Created User:", user._id);

        // Attempt to update like the controller does
        user.emailAlerts = { enabled: true, time: '12:00' };
        user.preferences = { currency: 'USD' };

        await user.save();
        console.log("Successfully saved!");
        console.log("Result:", user.emailAlerts, user.preferences);

        // Cleanup
        await User.deleteOne({ _id: user._id });
        process.exit(0);

    } catch (err) {
        console.error("ERROR HAPPENED:", err.message);
        console.error("FULL ERROR:", err);
        process.exit(1);
    }
}

testUpdate();
