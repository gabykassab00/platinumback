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

  // Fallback safety
  const safeTotal = Number(total || 0);
  const itemList = Array.isArray(items)
    ? items.map(item => {
        const quantity = Number(item.quantity || 0);
        const price = Number(item.price || 0);
        const name = item.name || 'Unnamed Item';
        return `${name} (x${quantity}) - $${(price * quantity).toFixed(2)}`;
      }).join('\n')
    : 'No items listed';

  const templateParams = {
    to_name: to_name || 'Customer',
    to_email: to_email || 'missing@email.com',
    address: address || 'N/A',
    city: city || 'N/A',
    total: `$${safeTotal.toFixed(2)}`,
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
    throw new Error(error.response?.data?.error || 'Failed to send email');
  }
};

module.exports = { sendEmail };
