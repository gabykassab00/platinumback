// // routes/emailRoutes.js
// const express = require('express');
// const router = express.Router();
// const { sendEmail } = require('../emailService'); // ✅ make sure this file exists

// // POST /api/email/send-confirmation
// router.post('/send-confirmation', async (req, res) => {
//   const { to_name, to_email, address, city, total, items } = req.body;

//   try {
//     await sendEmail({ to_name, to_email, address, city, total, items });
//     res.status(200).json({ success: true, message: 'Email sent successfully' });
//   } catch (err) {
//     console.error('❌ Email sending failed:', err.message);
//     res.status(500).json({ success: false, error: 'Failed to send email' });
//   }
// });

// module.exports = router;








const express = require('express');
const router = express.Router();
const { sendEmail } = require('../emailService');

// POST /api/email/send-confirmation
router.post('/send-confirmation', async (req, res) => {
  const { to_name, to_email, address, city, total, items } = req.body;

  // Debug log: Check incoming data
  console.log('📨 Email send request received:', {
    to_name,
    to_email,
    address,
    city,
    total,
    items
  });

  // Validate required fields
  if (!to_name || !to_email || !address || !city || !total || !Array.isArray(items)) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields or invalid items array'
    });
  }

  try {
    const result = await sendEmail({ to_name, to_email, address, city, total, items });
    console.log('✅ Email successfully sent:', result);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('❌ Email sending failed:', err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.message || 'Failed to send email' });
  }
});

module.exports = router;
