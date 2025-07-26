export default async function handler(req, res) {
  const { MerchantOrderNo, Amt, TradeNo } = req.query;

  const html = `
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>付款成功</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .success-container {
                background: white;
                padding: 3rem;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 500px;
                margin: 2rem;
            }
            .success-icon {
                width: 80px;
                height: 80px;
                background: #28a745;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 2rem;
                font-size: 2.5rem;
                color: white;
            }
            .success-title {
                color: #333;
                font-size: 2rem;
                margin-bottom: 1rem;
                font-weight: bold;
            }
            .success-message {
                color: #666;
                font-size: 1.1rem;
                line-height: 1.6;
                margin-bottom: 2rem;
            }
            .order-info {
                background: #f8f9fa;
                padding: 1.5rem;
                border-radius: 10px;
                margin-bottom: 2rem;
                text-align: left;
            }
            .order-info h3 {
                margin-top: 0;
                color: #333;
                font-size: 1.2rem;
            }
            .order-info p {
                margin: 0.5rem 0;
                color: #666;
            }
            .btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1rem 2rem;
                border: none;
                border-radius: 25px;
                text-decoration: none;
                display: inline-block;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease;
            }
            .btn:hover {
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body>
        <div class="success-container">
            <div class="success-icon">✓</div>
            <h1 class="success-title">付款成功！</h1>
            <p class="success-message">
                感謝您的訂閱！我們已經收到您的付款，
                <br>訂閱服務將立即生效。
            </p>
            
            ${MerchantOrderNo ? `
            <div class="order-info">
                <h3>訂單資訊</h3>
                <p><strong>訂單編號：</strong>${MerchantOrderNo}</p>
                ${Amt ? `<p><strong>付款金額：</strong>NT$ ${Amt}</p>` : ''}
                ${TradeNo ? `<p><strong>交易編號：</strong>${TradeNo}</p>` : ''}
                <p><strong>付款時間：</strong>${new Date().toLocaleString('zh-TW')}</p>
            </div>
            ` : ''}
            
            <a href="/" class="btn">返回首頁</a>
        </div>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}
