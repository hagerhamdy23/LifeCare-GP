const clinicLoginForm = document.getElementById('clinicLoginForm');
if (clinicLoginForm) {
    clinicLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        if (!email || !password) {
            alert('من فضلك أدخل البريد الإلكتروني وكلمة السر');
            return;
        }
        
        const userData = {
            email: email,
            type: 'clinic'
        };
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        
        console.log('تسجيل دخول العيادة:', { email, password });
        alert('تم تسجيل الدخول بنجاح!');
        window.location.href = 'clinic-dashboard.html';
    });
}

const pharmacyLoginForm = document.getElementById('pharmacyLoginForm');
if (pharmacyLoginForm) {
    pharmacyLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        if (!email || !password) {
            alert('من فضلك أدخل البريد الإلكتروني وكلمة السر');
            return;
        }
        
        const userData = {
            email: email,
            type: 'pharmacy'
        };
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        
        console.log('تسجيل دخول الصيدلية:', { email, password });
        alert('تم تسجيل الدخول بنجاح!');
        window.location.href = 'clinic-dashboard.html';
    });
}

const clinicRegisterForm = document.getElementById('clinicRegisterForm');
if (clinicRegisterForm) {
    clinicRegisterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inputs = this.querySelectorAll('input');
        const name = inputs[0].value;
        const clinicName = inputs[1].value;
        const email = inputs[2].value;
        const password = inputs[3].value;
        const confirmPassword = inputs[4].value;
        const phone = inputs[5].value;
        
        if (!name || !clinicName || !email || !password || !confirmPassword || !phone) {
            alert('من فضلك املأ جميع الحقول');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('كلمة السر غير متطابقة');
            return;
        }
        
        if (password.length < 6) {
            alert('كلمة السر يجب أن تكون 6 أحرف على الأقل');
            return;
        }
        
        const userData = {
            name: name,
            clinicName: clinicName,
            email: email,
            phone: phone,
            type: 'clinic'
        };
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        
        console.log('تسجيل العيادة:', { name, clinicName, email, phone });
        alert('تم التسجيل بنجاح!');
        window.location.href = 'clinic-dashboard.html';
    });
}

const pharmacyRegisterForm = document.getElementById('pharmacyRegisterForm');
if (pharmacyRegisterForm) {
    pharmacyRegisterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inputs = this.querySelectorAll('input');
        const name = inputs[0].value;
        const pharmacyName = inputs[1].value;
        const email = inputs[2].value;
        const password = inputs[3].value;
        const confirmPassword = inputs[4].value;
        const phone = inputs[5].value;
        
        if (!name || !pharmacyName || !email || !password || !confirmPassword || !phone) {
            alert('من فضلك املأ جميع الحقول');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('كلمة السر غير متطابقة');
            return;
        }
        
        if (password.length < 6) {
            alert('كلمة السر يجب أن تكون 6 أحرف على الأقل');
            return;
        }
        
        const userData = {
            name: name,
            pharmacyName: pharmacyName,
            email: email,
            phone: phone,
            type: 'pharmacy'
        };
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        
        console.log('تسجيل الصيدلية:', { name, pharmacyName, email, phone });
        alert('تم التسجيل بنجاح!');
        window.location.href = 'clinic-dashboard.html'; 
    });
}