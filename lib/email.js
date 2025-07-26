// 這裡可以整合你喜歡的 Email 服務
// 例如：Gmail API、SendGrid、Nodemailer 等

export async function sendSuccessEmail(email, orderData) {
  try {
    console.log('Sending success email to:', email);
    console.log('Order data:', orderData);
    
    // TODO: 實際的 Email 發送邏輯
    // 可以根據你的需求選擇合適的服務
    
    // 範例使用 console.log 模擬
    console.log(`
      付款成功通知
      ================
      訂單編號: ${orderData.orderNo}
      交易金額: NT$ ${orderData.amount}
      交易編號: ${orderData.transactionId}
      
      感謝您的訂閱！
    `);
    
  } catch (error) {
    console.error('Send email failed:', error);
  }
}
