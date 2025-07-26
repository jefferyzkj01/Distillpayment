import crypto from 'crypto';

const {
  NEWEBPAY_MERCHANT_ID,
  NEWEBPAY_HASH_KEY,
  NEWEBPAY_HASH_IV
} = process.env;

// AES 加密
function aesEncrypt(text, key, iv) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// AES 解密
function aesDecrypt(encryptedText, key, iv) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// SHA256 編碼
function sha256Encode(text) {
  return crypto.createHash('sha256').update(text).digest('hex').toUpperCase();
}

// 建立付款
export async function createPayment({ orderNo, amount, email, itemDesc, baseUrl }) {
  const timestamp = Math.floor(Date.now() / 1000);

  // 組建交易資料
  const tradeInfo = {
    MerchantID: NEWEBPAY_MERCHANT_ID,
    RespondType: 'JSON',
    TimeStamp: timestamp,
    Version: '2.0',
    MerchantOrderNo: orderNo,
    Amt: amount,
    ItemDesc: itemDesc,
    Email: email,
    NotifyURL: `${baseUrl}/api/payment-notify`,
    ReturnURL: `${baseUrl}/api/payment-success`,
    ClientBackURL: `${baseUrl}/api/payment-cancel`,
    CREDIT: 1,        // 啟用信用卡
    WEBATM: 1,        // 啟用 WebATM
    VACC: 1,          // 啟用 ATM 轉帳
    CVS: 1,           // 啟用超商代碼
    BARCODE: 1,       // 啟用超商條碼
    // 可根據需求調整支付方式
  };

  // 轉換為 query string
  const tradeInfoStr = new URLSearchParams(tradeInfo).toString();

  // AES 加密
  const encryptedData = aesEncrypt(tradeInfoStr, NEWEBPAY_HASH_KEY, NEWEBPAY_HASH_IV);

  // 產生檢查碼
  const shaString = `HashKey=${NEWEBPAY_HASH_KEY}&${encryptedData}&HashIV=${NEWEBPAY_HASH_IV}`;
  const tradeSha = sha256Encode(shaString);

  return {
    merchantId: NEWEBPAY_MERCHANT_ID,
    tradeInfo: encryptedData,
    tradeSha: tradeSha
  };
}

// 解密通知資料
export function decryptNotifyData(encryptedData) {
  return aesDecrypt(encryptedData, NEWEBPAY_HASH_KEY, NEWEBPAY_HASH_IV);
}
