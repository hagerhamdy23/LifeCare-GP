document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const headerRight = document.getElementById('headerRight');
    
    if (loggedInUser && headerRight) {
        const userData = JSON.parse(loggedInUser);
        
        headerRight.innerHTML = `
            <span class="join-text">مرحباً، ${userData.name || userData.email}</span>
            <button onclick="logout()" class="login-btn-header">تسجيل الخروج</button>
        `;
    }
    
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        mainContainer.style.opacity = '0';
        mainContainer.style.transform = 'translateY(20px)';
        mainContainer.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            mainContainer.style.opacity = '1';
            mainContainer.style.transform = 'translateY(0)';
        }, 100);
    }
});

function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.reload();
}