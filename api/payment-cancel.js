export default async function handler(req, res) {
  const html = `
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>付款取消</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .cancel-container {
                background: white;
                padding: 3rem;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 500px;
                margin: 2rem;
            }
            .cancel-icon {
                width: 80px;
                height: 80px;
                background: #dc3545;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 2rem;
                font-size: 2.5rem;
                color: white;
            }
            .cancel-title {
                color: #333;
                font-size: 2rem;
                margin-bottom: 1rem;
                font-weight: bold;
            }
            .cancel-message {
                color: #666;
                font-size: 1.1rem;
                line-height: 1.6;
                margin-bottom: 2rem;
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
                margin: 0.5rem;
            }
            .btn:hover {
                transform: translateY(-2px);
            }
            .btn-secondary {
                background: #6c757d;
            }
        </style>
    </head>
    <body>
        <div class="cancel-container">
            <div class="cancel-icon">✕</div>
            <h1 class="cancel-title">付款已取消</h1>
            <p class="cancel-message">
                您已取消此次付款操作。
                <br>如有任何問題，請聯繫我們的客服團隊。
            </p>
            
            <a href="/" class="btn">重新選擇方案</a>
            <a href="mailto:support@example.com" class="btn btn-secondary">聯繫客服</a>
        </div>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}
