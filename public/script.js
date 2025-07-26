let selectedPlan = '';
let selectedAmount = 0;

// DOM 載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

// 初始化事件監聽器
function initializeEventListeners() {
    // 訂閱按鈕事件
    const subscribeButtons = document.querySelectorAll('.btn-subscribe');
    subscribeButtons.forEach(button => {
        button.addEventListener('click', handleSubscribeClick);
    });

    // 模態框關閉事件
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // 點擊模態框外部關閉
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // 表單提交事件
    const form = document.getElementById('subscriptionForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Email 輸入驗證
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', validateEmail);
    }

    // ESC 鍵關閉模態框
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

// 處理訂閱按鈕點擊
function handleSubscribeClick(event) {
    const button = event.target;
    selectedPlan = button.getAttribute('data-plan');
    selectedAmount = parseInt(button.getAttribute('data-amount'));
    
    // 更新模態框中的方案資訊
    updateSelectedPlanDisplay();
    
    // 顯示模態框
    showModal();
}

// 更新選擇的方案顯示
function updateSelectedPlanDisplay() {
    const selectedPlanElement = document.querySelector('.selected-plan');
    if (selectedPlanElement) {
        selectedPlanElement.innerHTML = `
            <strong>${selectedPlan}</strong>
            <br>
            <span style="color: #667eea; font-size: 1.2rem;">NT$ ${selectedAmount.toLocaleString()}/月</span>
        `;
    }
}

// 顯示模態框
function showModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.style.display = 'block';
        // 聚焦到 email 輸入框
        setTimeout(() => {
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.focus();
            }
        }, 100);
    }
}

// 關閉模態框
function closeModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // 清空表單
    const form = document.getElementById('subscriptionForm');
    if (form) {
        form.reset();
    }
    
    // 重置驗證狀態
    resetValidation();
}

// Email 驗證
function validateEmail() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    const submitButton = document.querySelector('.btn-primary');
    
    if (isValidEmail(email)) {
        emailInput.style.borderColor = '#28a745';
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
        }
    } else {
        emailInput.style.borderColor = '#dc3545';
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.style.opacity = '0.6';
        }
    }
}

// 檢查 Email 格式
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 重置驗證狀態
function resetValidation() {
    const emailInput = document.getElementById('email');
    const submitButton = document.querySelector('.btn-primary');
    
    if (emailInput) {
        emailInput.style.borderColor = '#ddd';
    }
    
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
    }
}

// 處理表單提交
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    
    // 最終驗證
    if (!email || !isValidEmail(email)) {
        showAlert('請輸入有效的 Email 地址', 'error');
        return;
    }
    
    if (!selectedPlan || !selectedAmount) {
        showAlert('請選擇訂閱方案', 'error');
        return;
    }
    
    try {
        // 關閉模態框並顯示載入畫面
        closeModal();
        showLoading(true);
        
        // 發送請求到後端 API
        const response = await fetch('/api/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                plan: selectedPlan,
                amount: selectedAmount
            })
        });
        
        const result = await response.json();
        
        if (result.success && result.formData) {
            // 建立付款表單並自動提交
            createAndSubmitPaymentForm(result);
        } else {
            throw new Error(result.message || '付款連結建立失敗');
        }
        
    } catch (error) {
        console.error('Payment creation error:', error);
        showLoading(false);
        showAlert('處理失敗：' + error.message, 'error');
    }
}

// 建立並提交付款表單
function createAndSubmitPaymentForm(paymentData) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentData.paymentUrl;
    form.style.display = 'none';
    
    // 添加隱藏欄位
    Object.keys(paymentData.formData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData.formData[key];
        form.appendChild(input);
    });
    
    // 將表單添加到頁面並提交
    document.body.appendChild(form);
    
    // 延遲提交，讓用戶看到載入畫面
    setTimeout(() => {
        form.submit();
    }, 1000);
}

// 顯示/隱藏載入畫面
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
}

// 顯示提示訊息
function showAlert(message, type = 'info') {
    // 建立提示框
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    // 設定顏色
    if (type === 'error') {
        alertDiv.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
    } else if (type === 'success') {
        alertDiv.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    } else {
        alertDiv.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }
    
    alertDiv.textContent = message;
    
    // 添加關閉按鈕
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 10px;
        cursor: pointer;
        font-size: 1.2rem;
    `;
    closeBtn.onclick = () => alertDiv.remove();
    alertDiv.appendChild(closeBtn);
    
    // 添加到頁面
    document.body.appendChild(alertDiv);
    
    // 自動移除
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// 添加 CSS 動畫
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// 頁面載入完成提示
console.log('付款系統已載入完成');
