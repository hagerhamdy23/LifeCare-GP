function goBack() {
    window.history.back();
}

const otpInputs = document.querySelectorAll('.otp-input');

otpInputs.forEach((input, index) => {
    input.addEventListener('input', function(e) {
        const value = e.target.value;
        
        if (!/^\d*$/.test(value)) {
            e.target.value = '';
            return;
        }
        
        if (value && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });
    
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            otpInputs[index - 1].focus();
        }
    });
    
    input.addEventListener('paste', function(e) {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const digits = pastedData.replace(/\D/g, '').split('');
        
        digits.forEach((digit, i) => {
            if (otpInputs[index + i]) {
                otpInputs[index + i].value = digit;
            }
        });
        
        const lastIndex = Math.min(index + digits.length, otpInputs.length - 1);
        otpInputs[lastIndex].focus();
    });
});

const otpForm = document.getElementById('otpForm');

if (otpForm) {
    otpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let otp = '';
        otpInputs.forEach(input => {
            otp += input.value;
        });
        
        if (otp.length !== 4) {
            alert('من فضلك أدخل رمز التحقق كاملاً');
            return;
        }
        
        console.log('OTP:', otp);
        alert('تم التحقق من الرمز بنجاح!');
        
        window.location.href = 'password-success.html';
    });
}

const resendLink = document.querySelector('.resend-link');
if (resendLink) {
    resendLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('تم إرسال رمز جديد إلى بريدك الإلكتروني!');
        
        otpInputs.forEach(input => {
            input.value = '';
        });
        otpInputs[0].focus();
    });
}

if (otpInputs.length > 0) {
    otpInputs[0].focus();
}