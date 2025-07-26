import { GoogleSpreadsheet } from 'google-spreadsheet';

const {
  GOOGLE_SHEET_ID,
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY
} = process.env;

// 取得 Google Sheets 實例
async function getSheet() {
  const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID);
  
  await doc.useServiceAccountAuth({
    client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  });

  await doc.loadInfo();
  return doc.sheetsByIndex[0]; // 使用第一個工作表
}

// 更新 Google Sheets
export async function updateGoogleSheets(data) {
  try {
    const sheet = await getSheet();
    
    await sheet.addRow({
      訂單編號: data.orderNo,
      Email: data.email,
      訂閱方案: data.plan,
      金額: data.amount,
      狀態: data.status,
      建立時間: data.createdAt,
      更新時間: data.createdAt,
      交易編號: data.transactionId || '',
      付款方式: data.paymentType || '',
      付款時間: data.paymentTime || ''
    });

    console.log('Google Sheets updated:', data.orderNo);
  } catch (error) {
    console.error('Google Sheets update failed:', error);
    throw error;
  }
}

// 更新付款狀態
export async function updatePaymentStatus(orderNo, updateData) {
  try {
    const sheet = await getSheet();
    const rows = await sheet.getRows();

    const targetRow = rows.find(row => row.get('訂單編號') === orderNo);
    
    if (targetRow) {
      targetRow.set('狀態', updateData.status);
      targetRow.set('更新時間', new Date().toISOString());
      
      if (updateData.transactionId) {
        targetRow.set('交易編號', updateData.transactionId);
      }
      if (updateData.paymentType) {
        targetRow.set('付款方式', updateData.paymentType);
      }
      if (updateData.paymentTime) {
        targetRow.set('付款時間', updateData.paymentTime);
      }

      await targetRow.save();
      console.log('Payment status updated:', orderNo, updateData.status);
    } else {
      console.error('Order not found in sheets:', orderNo);
    }
  } catch (error) {
    console.error('Update payment status failed:', error);
    throw error;
  }
}
