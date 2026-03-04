const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, htmlContent) => {
    try {
        // Create transporter using environment variables
        // We use a generic SMTP setup so it can be configured for Gmail, SendGrid, etc.
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"CrediFlow Reminders" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: htmlContent
        };

        // Only send if credentials exist to prevent crashing
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️ EMAIL_USER or EMAIL_PASS not set in .env. Skipping email delivery to:', to);
            return false;
        }

        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent to ${to}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`❌ Error sending email to ${to}:`, error.message);
        return false;
    }
};

module.exports = { sendEmail };
