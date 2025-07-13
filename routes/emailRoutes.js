// routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const emailjs = require('emailjs');
require('dotenv').config();

const server = emailjs.server.connect({
  user: process.env.EMAILJS_USER,
  password: process.env.EMAILJS_PASSWORD,
  host: 'smtp.yourprovider.com', // Optional: If you're not using EmailJS SMTP
  ssl: true
});

router.post('/send-confirmation', async (req, res) => {
  const { toEmail, name, orderDetails } = req.body;

  const message = {
    text: `Hello ${name},\n\nThank you for your order!\n\n${orderDetails}`,
    from: process.env.EMAILJS_FROM,
    to: toEmail,
    subject: 'Order Confirmation - Platinum Perfumes'
  };

  try {
    server.send(message, function (err, message) {
      if (err) {
        console.error('Email error:', err);
        return res.status(500).json({ success: false, error: err });
      }
      res.json({ success: true, message: 'Email sent successfully!' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send confirmation email.' });
  }
});

module.exports = router;
