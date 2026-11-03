import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export const generateOrderInvoicePDF = async (order, businessProfile) => {
  try {
    const itemsHtml = order.items
      .map(
        (item, index) => `
        <tr style="border-bottom: 1px solid #E5E7EB;">
          <td style="padding: 10px 8px; font-size: 14px;">${index + 1}</td>
          <td style="padding: 10px 8px; font-size: 14px; font-weight: 600;">${item.name}</td>
          <td style="padding: 10px 8px; font-size: 14px; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px 8px; font-size: 14px; text-align: right;">Rs. ${item.price.toLocaleString()}</td>
          <td style="padding: 10px 8px; font-size: 14px; text-align: right; font-weight: 700;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
        </tr>`
      )
      .join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice ${order.orderNumber}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111827; margin: 30px; }
          .header { border-bottom: 3px solid #006A4E; padding-bottom: 20px; display: flex; justify-content: space-between; }
          .biz-name { font-size: 26px; font-weight: 800; color: #006A4E; margin: 0; }
          .biz-phone { font-size: 13px; color: #6B7280; margin-top: 4px; }
          .invoice-title { font-size: 24px; font-weight: 800; color: #111827; text-align: right; margin: 0; }
          .meta-info { margin: 24px 0; display: flex; justify-content: space-between; background: #F9FAFB; padding: 16px; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #006A4E; color: white; padding: 10px 8px; font-size: 13px; text-align: left; }
          .summary { margin-top: 24px; margin-left: auto; width: 280px; }
          .summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
          .grand-total { border-top: 2px solid #006A4E; margin-top: 8px; padding-top: 10px; font-size: 18px; font-weight: 800; color: #006A4E; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="biz-name">${businessProfile.name}</h1>
            <div class="biz-phone">Tel: ${businessProfile.phone}</div>
          </div>
          <div>
            <h2 class="invoice-title">INVOICE</h2>
            <div style="font-size: 13px; color: #6B7280; text-align: right;">${order.orderNumber} • ${order.date}</div>
          </div>
        </div>

        <div class="meta-info">
          <div>
            <div style="font-size: 12px; color: #9CA3AF; text-transform: uppercase;">Billed To:</div>
            <div style="font-size: 16px; font-weight: 700; margin-top: 4px;">${order.customerName}</div>
            <div style="font-size: 13px; color: #4B5563;">${order.customerPhone}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: #9CA3AF; text-transform: uppercase;">Payment Status:</div>
            <div style="font-size: 15px; font-weight: 700; color: #006A4E; margin-top: 4px;">${order.status} (${order.paymentMethod})</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 40px;">#</th>
              <th>Item Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>Rs. ${order.subtotal.toLocaleString()}</span>
          </div>
          <div class="summary-row">
            <span>Delivery Charges:</span>
            <span>Rs. ${order.deliveryCharges.toLocaleString()}</span>
          </div>
          <div class="summary-row grand-total">
            <span>Total Payable:</span>
            <span>Rs. ${order.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div class="footer">
          Thank you for choosing ${businessProfile.name}!<br>
          For queries contact: ${businessProfile.phone}
        </div>
      </body>
    </html>
    `;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
      });
    } else {
      Alert.alert('PDF Created', `File saved at ${uri}`);
    }
  } catch (error) {
    Alert.alert('PDF Error', 'Failed to generate PDF invoice.');
  }
};
