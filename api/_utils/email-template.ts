export interface EmailItem {
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  image?: string;
}

export function generateOrderEmailHtml(data: {
  customerName: string;
  orderNumber: string;
  items: EmailItem[];
  region: string;
  shippingAddress?: string;
  total: number;
  currency?: string;
}) {
  const { customerName, orderNumber, items, region, shippingAddress, total, currency = 'USD' } = data;

  const itemRows = items.map(item => `
    <div style="display: flex; gap: 16px; align-items: center; padding: 16px 0; border-bottom: 1px solid rgba(45, 31, 28, 0.1);">
      <div style="width: 64px; height: 64px; background: white; border-radius: 8px; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
        <img src="${item.image || ''}" alt="${item.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
      </div>
      <div style="flex: 1;">
        <h4 style="margin: 0; font-family: 'Times New Roman', serif; color: #2D1F1C;">${item.name}</h4>
        <p style="margin: 4px 0 0; font-size: 14px; color: rgba(45, 31, 28, 0.6);">
          ${[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(' | ')}
        </p>
      </div>
      <div style="text-align: right;">
        <p style="margin: 0; font-weight: 500; color: #2D1F1C;">$${item.price.toFixed(2)}</p>
        <p style="margin: 4px 0 0; font-size: 14px; color: rgba(45, 31, 28, 0.6);">Qty: ${item.quantity}</p>
      </div>
    </div>
  `).join('');

  const deliveryMessage = region === 'Cambodia' 
    ? "You will receive a personal message shortly to coordinate Grab delivery."
    : "Delivery begins in July. Thank you so much for your patience!";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for your order</title>
</head>
<body style="margin: 0; padding: 0; background-color: #E5DCCD; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2D1F1C;">
  <div style="max-width: 600px; margin: 40px auto; padding: 40px 20px;">
    <div style="background-color: rgba(255, 255, 255, 0.5); border-radius: 32px; padding: 40px; border: 1px solid rgba(255, 255, 255, 0.4); text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
      <h1 style="font-family: 'Times New Roman', serif; font-size: 32px; margin-bottom: 24px;">Thank you for supporting my art, ${customerName}</h1>
      
      <div style="background-color: rgba(119, 156, 145, 0.1); border-radius: 20px; padding: 24px; margin-bottom: 32px; border: 1px solid rgba(119, 156, 145, 0.2);">
        <h3 style="font-family: 'Times New Roman', serif; font-size: 20px; color: #93312A; margin: 0 0 8px;">Delivery Information</h3>
        <p style="margin: 0; color: rgba(45, 31, 28, 0.8); line-height: 1.5;">${deliveryMessage}</p>
      </div>

      <div style="text-align: left; background-color: rgba(255, 255, 255, 0.6); border-radius: 20px; padding: 24px; border: 1px solid rgba(255, 255, 255, 0.6);">
        <h3 style="font-family: 'Times New Roman', serif; font-size: 24px; margin: 0 0 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(45, 31, 28, 0.1);">Order Summary</h3>
        <p style="font-size: 14px; color: rgba(45, 31, 28, 0.6); margin-bottom: 20px;">Order #: ${orderNumber}</p>
        
        <div style="margin-bottom: 24px;">
          ${itemRows}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 16px; border-top: 2px solid rgba(45, 31, 28, 0.05);">
          <span style="font-size: 18px;">Total</span>
          <span style="font-size: 24px; font-weight: 600;">$${total.toFixed(2)} ${currency}</span>
        </div>
      </div>

      ${shippingAddress ? `
      <div style="text-align: left; margin-top: 32px; padding: 0 8px;">
        <h3 style="font-family: 'Times New Roman', serif; font-size: 18px; margin-bottom: 12px;">Shipping Address</h3>
        <p style="margin: 0; color: rgba(45, 31, 28, 0.7); line-height: 1.6; white-space: pre-line;">${shippingAddress}</p>
      </div>
      ` : ''}

      <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid rgba(45, 31, 28, 0.1);">
        <p style="font-size: 14px; color: rgba(45, 31, 28, 0.6); margin-bottom: 12px;">Follow the journey behind the art</p>
        <a href="https://instagram.com/rachagold.art" style="color: #2D1F1C; text-decoration: none; font-weight: 500;">@rachagold.art</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
