import { Linking, Alert } from 'react-native';

export const sendWhatsAppReminder = async (customer, businessProfile, language = 'ur') => {
  if (!customer || !customer.phone) {
    Alert.alert('Error', 'Customer phone number not available.');
    return;
  }

  // Format Pakistani phone to international format
  let cleanPhone = customer.phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '92' + cleanPhone.substring(1);
  } else if (!cleanPhone.startsWith('92')) {
    cleanPhone = '92' + cleanPhone;
  }

  const messageUrdu = `محترم ${customer.name} صاحب! سلام مسنون۔\n` +
    `کاروبار: *${businessProfile.name}*\n` +
    `آپ کے کھاتے میں بقایا رقم: *Rs. ${customer.totalDue.toLocaleString()}* ہے۔\n` +
    `براہ کرم ادائیگی جلد از جلد ممکن بنائیں۔\n` +
    `شکریہ!\nرابطہ: ${businessProfile.phone}`;

  const messageEnglish = `Dear ${customer.name},\n` +
    `This is a gentle payment reminder from *${businessProfile.name}*.\n` +
    `Your outstanding khata balance is *Rs. ${customer.totalDue.toLocaleString()}*.\n` +
    `Please arrange the payment at your earliest convenience.\n` +
    `Thank you!\nContact: ${businessProfile.phone}`;

  const message = language === 'ur' ? messageUrdu : messageEnglish;
  const url = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      // Fallback to web link
      await Linking.openURL(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`);
    }
  } catch (error) {
    Alert.alert('WhatsApp Error', 'Could not open WhatsApp on this device.');
  }
};
