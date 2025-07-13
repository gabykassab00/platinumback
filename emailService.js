// services/emailService.js
const axios = require('axios');

const sendEmail = async ({ to_name, to_email, message }) => {
  const serviceID = process.env.EMAILJS_SERVICE_ID;
  const templateID = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  const templateParams = {
    to_name,
    to_email,
    message
  };

  try {
    const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
      service_id: serviceID,
      template_id: templateID,
      user_id: publicKey,
      template_params: templateParams,
    });

    return response.data;
  } catch (error) {
    console.error('Error sending email via EmailJS:', error.response?.data || error.message);
    throw new Error('Failed to send email');
  }
};

module.exports = { sendEmail };
