import { decryptNotifyData } from '../lib/newebpay.js';
import { updatePaymentStatus } from '../lib/sheets.js';
import { sendSuccessEmail } from '../lib/email.js';

export default async function handler(req, res) {
  console.log('Payment notification received');

  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    // 解密藍新金流回傳資料
    const { TradeInfo } = req.body;
    
    if (!TradeInfo) {
      console.error('No TradeInfo received');
      return res.status(400).send('Missing TradeInfo');
    }

    const decryptedData = decryptNotifyData(TradeInfo);
    const result = JSON.parse(decryptedData);

    console.log('Decrypted payment result:', result);

    if (result.Status === 'SUCCESS') {
      const orderData = result.Result;
      
      // 更新 Google Sheets 付款狀態
      await updatePaymentStatus(orderData.MerchantOrderNo, {
        status: 'paid',
        transactionId: orderData.TradeNo,
        paymentType: orderData.PaymentType,
        paymentTime: new Date().toISOString()
      });

      // 發送付款成功通知
      if (orderData.Email) {
        await sendSuccessEmail(orderData.Email, {
          orderNo: orderData.MerchantOrderNo,
          amount: orderData.Amt,
          transactionId: orderData.TradeNo
        });
      }

      console.log('Payment success processed:', orderData.MerchantOrderNo);
    } else {
      // 付款失敗處理
      await updatePaymentStatus(result.Result?.MerchantOrderNo, {
        status: 'failed',
        failureReason: result.Message
      });
    }

    // 回應藍新金流 (必須回傳 1)
    return res.status(200).send('1');

  } catch (error) {
    console.error('Payment notification error:', error);
    return res.status(500).send('0');
  }
}
