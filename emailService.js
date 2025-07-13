// services/emailService.js
const axios = require('axios');

const sendEmail = async ({
  to_name,
  to_email,
  address,
  city,
  total,
  items,
}) => {
  const serviceID = process.env.EMAILJS_SERVICE_ID;
  const templateID = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  const itemList = items.map(item =>
    `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');

  const templateParams = {
    to_name,
    to_email,
    address,
    city,
    total: `$${total.toFixed(2)}`,
    item_list: itemList,
  };

  try {
    const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
      service_id: serviceID,
      template_id: templateID,
      user_id: publicKey,
      template_params: templateParams,
    });

    console.log('✅ Email sent via EmailJS:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error sending email via EmailJS:', error.response?.data || error.message);
    throw new Error('Failed to send email');
  }
};

module.exports = { sendEmail };
