function goBack() {
    window.history.back();
}

const forgotPasswordForm = document.getElementById('forgotPasswordForm');

if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        
        if (!email) {
            alert('من فضلك أدخل البريد الإلكتروني');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('من فضلك أدخل بريد إلكتروني صحيح');
            return;
        }
        
        console.log('إرسال رمز التحقق إلى:', email);
        alert('تم إرسال رمز التحقق إلى بريدك الإلكتروني!');
        
        setTimeout(() => {
            window.location.href = 'otp-verification.html';
        }, 500);
    });
}