// routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const { sendEmail } = require('../emailService'); // ✅ make sure this file exists

// POST /api/email/send-confirmation
router.post('/send-confirmation', async (req, res) => {
  const { to_name, to_email, address, city, total, items } = req.body;

  try {
    await sendEmail({ to_name, to_email, address, city, total, items });
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

module.exports = router;
