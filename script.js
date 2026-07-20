/* script.js - Toouch Landing Page Client Script */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Countdown Timer (for order.html page)
  startCountdown();

  // 2. Set up Nav Link Active Highlighting
  setupNavHighlighting();

  // 3. Set up Form Submissions
  setupForms();
});

/**
 * Handles the persistent countdown timer on the Pre-Order Page 2
 */
function startCountdown() {
  const timerElement = document.getElementById('countdown-timer');
  if (!timerElement) return;

  // Initial countdown duration set to 72 hours
  const initialDurationMs = 72 * 3600 * 1000;
  
  let targetTime = localStorage.getItem('toouch_countdown_target_72h');
  
  if (!targetTime) {
    targetTime = Date.now() + initialDurationMs;
    localStorage.setItem('toouch_countdown_target_72h', targetTime);
  } else {
    targetTime = parseInt(targetTime, 10);
    // If the timer expired in the past, reset it for simulation/demonstration
    if (targetTime <= Date.now()) {
      targetTime = Date.now() + initialDurationMs;
      localStorage.setItem('toouch_countdown_target_72h', targetTime);
    }
  }

  function updateTimer() {
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
      timerElement.textContent = "00:00:00";
      clearInterval(intervalId);
      return;
    }

    const totalSecs = Math.floor(diff / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const formattedHrs = String(hrs).padStart(2, '0');
    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');

    timerElement.textContent = `${formattedHrs}:${formattedMins}:${formattedSecs}`;
  }

  updateTimer(); // Run once immediately
  const intervalId = setInterval(updateTimer, 1000);
}

/**
 * Dynamically highlights active navigation links matching the current file
 */
function setupNavHighlighting() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Check if the current pathname contains the link's target path
    if (currentPath.endsWith(href) || (currentPath.endsWith('/') && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Validates inputs and handles submission for all order & workshop forms
 */
function setupForms() {
  const forms = document.querySelectorAll('.booking-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const inputs = form.querySelectorAll('.form-input');
      let isValid = true;
      let errorMessage = '';

      inputs.forEach(input => {
        const val = input.value.trim();
        const placeholder = input.getAttribute('placeholder') || '';
        const fieldName = placeholder.replace('• ', '');

        if (!val) {
          isValid = false;
          errorMessage = `Vui lòng điền trường ${fieldName}`;
          input.focus();
          return;
        }

        // Specific email validation
        if (input.type === 'email' && !validateEmail(val)) {
          isValid = false;
          errorMessage = 'Địa chỉ email không hợp lệ!';
          input.focus();
          return;
        }

        // Specific phone number validation (basic checks for Vietnam numbers)
        if (placeholder.includes('SỐ ĐIỆN THOẠI') && !/^[0-9]{9,11}$/.test(val.replace(/[\s.-]/g, ''))) {
          isValid = false;
          errorMessage = 'Số điện thoại không hợp lệ! Vui lòng nhập từ 9-11 chữ số.';
          input.focus();
          return;
        }
      });

      if (!isValid) {
        showToast('Lỗi đăng ký', errorMessage, 'error');
        return;
      }

      // Check if it's a Pre-Order form or a Workshop form
      const isPreorder = form.id.includes('preorder');
      const actionTitle = isPreorder ? 'Đặt hàng Pre-order' : 'Đăng ký Workshop';
      const actionMessage = isPreorder 
        ? 'Đơn đặt hàng của bạn đã được ghi nhận thành công! Toouch sẽ sớm liên hệ xác nhận.'
        : 'Đăng ký tham gia Workshop thành công! Vé và hướng dẫn sẽ được gửi qua email.';

      showToast(actionTitle, actionMessage, 'success');
      form.reset();
    });
  });
}

/**
 * Email syntax regex helper
 */
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.toLowerCase());
}

/**
 * Renders custom premium glassmorphic toast alerts on screen
 */
function showToast(title, message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  if (type === 'error') {
    toast.style.borderLeft = '5px solid #d9534f';
    toast.style.borderColor = '#d9534f';
  }

  const iconSymbol = type === 'success' ? '✓' : '✕';
  const iconBg = type === 'success' ? 'var(--accent-brown)' : '#d9534f';

  toast.innerHTML = `
    <div class="toast-icon" style="background-color: ${iconBg};">${iconSymbol}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;

  container.appendChild(toast);
  
  // Transition in
  setTimeout(() => toast.classList.add('show'), 50);

  // Transition out and destroy
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}
