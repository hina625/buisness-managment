export const parseWhatsAppOrderText = (rawText, products = []) => {
  if (!rawText || typeof rawText !== 'string') {
    return null;
  }

  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  
  let customerName = '';
  let customerPhone = '';
  const matchedItems = [];

  // 1. Extract Phone (+923001234567 or 03001234567 or 0300-1234567)
  const phoneRegex = /(?:\+92|92|0)?3[0-9]{2}[- ]?[0-9]{7}/;
  const phoneMatch = rawText.match(phoneRegex);
  if (phoneMatch) {
    customerPhone = phoneMatch[0].replace(/[- ]/g, '');
    if (customerPhone.startsWith('92')) {
      customerPhone = '0' + customerPhone.substring(2);
    } else if (customerPhone.startsWith('+92')) {
      customerPhone = '0' + customerPhone.substring(3);
    }
  }

  // 2. Extract Name
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.startsWith('name:') || lower.startsWith('customer:') || lower.startsWith('naam:')) {
      customerName = line.split(':')[1]?.trim() || '';
      break;
    }
  }

  // If no "Name:" tag, take first line if it's not a phone or product
  if (!customerName && lines.length > 0) {
    const firstLine = lines[0];
    if (!firstLine.match(phoneRegex) && firstLine.length < 30) {
      customerName = firstLine.replace(/^(hi|hello|salam|aaoa)[, ]*/i, '').trim();
    }
  }

  if (!customerName) {
    customerName = 'WhatsApp Customer';
  }

  // 3. Match Products & Quantities
  products.forEach((prod) => {
    const prodLower = prod.name.toLowerCase();
    const regex = new RegExp(`(\\d+)?\\s*(?:x|pcs|qty)?\\s*${prodLower}|${prodLower}\\s*(?:x|qty|pcs|:)?\\s*(\\d+)?`, 'i');
    const match = rawText.match(regex);

    if (match || rawText.toLowerCase().includes(prodLower)) {
      let qty = 1;
      // Try to find quantity number in matching text
      const qtyMatch = rawText.match(new RegExp(`(\\d+)\\s*(?:x|pcs)?\\s*${prodLower}`, 'i')) ||
                       rawText.match(new RegExp(`${prodLower}\\s*(?:x|:|qty)?\\s*(\\d+)`, 'i'));
      if (qtyMatch && qtyMatch[1]) {
        qty = parseInt(qtyMatch[1], 10) || 1;
      }

      matchedItems.push({
        productId: prod.id,
        name: prod.name,
        price: prod.price,
        quantity: Math.min(Math.max(qty, 1), 50),
      });
    }
  });

  return {
    customerName,
    customerPhone: customerPhone || '0300 0000000',
    items: matchedItems.length > 0 ? matchedItems : null,
  };
};
