import { createPayment } from '../lib/newebpay.js';
import { updateGoogleSheets } from '../lib/sheets.js';

export default async function handler(req, res) {
  // 設定 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, plan, amount } = req.body;

    // 驗證必要參數
    if (!email || !plan || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: '缺少必要參數' 
      });
    }

    // 產生訂單編號
    const orderNo = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 1. 更新 Google Sheets
    await updateGoogleSheets({
      orderNo,
      email,
      plan,
      amount,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    // 2. 建立藍新金流付款
    const paymentData = await createPayment({
      orderNo,
      amount,
      email,
      itemDesc: `${plan} 訂閱方案`,
      baseUrl: process.env.BASE_URL
    });

    console.log('Payment created:', orderNo);

    return res.status(200).json({
      success: true,
      orderNo,
      paymentUrl: 'https://ccore.newebpay.com/MPG/mpg_gateway',
      formData: {
        MerchantID: paymentData.merchantId,
        TradeInfo: paymentData.tradeInfo,
        TradeSha: paymentData.tradeSha,
        Version: '2.0'
      }
    });

  } catch (error) {
    console.error('Create payment error:', error);
    return res.status(500).json({ 
      success: false, 
      message: '付款建立失敗，請稍後再試' 
    });
  }
}
