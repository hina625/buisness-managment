import { Linking, Alert } from 'react-native';

/**
 * Format Pakistani phone number to international WhatsApp format (e.g. 03001234567 -> 923001234567)
 */
export const formatWhatsAppPhone = (phone) => {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '92' + cleaned.substring(1);
  } else if (!cleaned.startsWith('92') && cleaned.length === 10) {
    cleaned = '92' + cleaned;
  }
  return cleaned;
};

/**
 * Builds formatted WhatsApp receipt text
 */
export const buildReceiptMessage = (order, businessProfile) => {
  const bizName = businessProfile?.name || 'Business Manager Store';
  const bizPhone = businessProfile?.phone || '';
  const bizAddress = businessProfile?.address ? `📍 ${businessProfile.address}\n` : '';

  const itemsList = (order.items || [])
    .map(
      (item, i) =>
        `${i + 1}. *${item.name}*\n   ${item.quantity} x Rs. ${Number(item.price).toLocaleString()} = *Rs. ${(Number(item.price) * Number(item.quantity)).toLocaleString()}*`
    )
    .join('\n\n');

  return (
    `🧾 *${bizName.toUpperCase()}* - *ORDER RECEIPT*\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `📋 *Order No:* ${order.orderNumber}\n` +
    `📅 *Date:* ${order.date}\n` +
    `👤 *Customer:* ${order.customerName}\n` +
    `📞 *Phone:* ${order.customerPhone}\n\n` +
    `📦 *ITEMS ORDERED:*\n` +
    `${itemsList}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `💵 Subtotal: Rs. ${Number(order.subtotal || 0).toLocaleString()}\n` +
    `🚚 Delivery: Rs. ${Number(order.deliveryCharges || 0).toLocaleString()}\n` +
    `💰 *TOTAL BILL: Rs. ${Number(order.totalAmount || 0).toLocaleString()}*\n` +
    `💳 Payment Mode: *${order.paymentMethod || 'Cash'}*\n` +
    `📌 Order Status: *${order.status || 'Pending'}*\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `${bizAddress}` +
    `${bizPhone ? `📞 Contact: ${bizPhone}\n` : ''}` +
    `✨ *Thank you for shopping with us!*`
  );
};

/**
 * Directly opens customer's WhatsApp chat with pre-filled digital receipt
 */
export const sendWhatsAppReceipt = async (order, businessProfile) => {
  try {
    const rawPhone = order.customerPhone;
    const formattedPhone = formatWhatsAppPhone(rawPhone);
    const message = buildReceiptMessage(order, businessProfile);
    const encoded = encodeURIComponent(message);

    const whatsappUrl = `whatsapp://send?phone=${formattedPhone}&text=${encoded}`;
    const webUrl = `https://wa.me/${formattedPhone}?text=${encoded}`;

    const canOpen = await Linking.canOpenURL(whatsappUrl);
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
    } else {
      await Linking.openURL(webUrl);
    }
  } catch (error) {
    console.error('WhatsApp Receipt error:', error);
    Alert.alert('Notice', 'Could not open WhatsApp directly. Please make sure WhatsApp is installed.');
  }
};
