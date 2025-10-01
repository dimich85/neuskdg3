// ===========================
// Telegram Web App Initialization
// ===========================
let tg = window.Telegram.WebApp;

// Expand app to full height
tg.expand();

// Enable closing confirmation
tg.enableClosingConfirmation();

// Set header color to match theme
tg.setHeaderColor('secondary_bg_color');

// User settings
let userSettings = {
    notifications: true,
    darkTheme: false,
    sounds: true
};

// ===========================
// Telegram MainButton Setup
// ===========================
function setupMainButton() {
    tg.MainButton.setText('ГОТОВО');
    tg.MainButton.color = tg.themeParams.button_color || '#2AABEE';
    tg.MainButton.textColor = tg.themeParams.button_text_color || '#FFFFFF';

    tg.MainButton.onClick(() => {
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }

        const activePage = document.querySelector('.page.active');
        if (activePage.id === 'settingsPage') {
            saveSettings();
        } else {
            showMain();
        }
    });
}

// ===========================
// BackButton Setup
// ===========================
tg.BackButton.onClick(() => {
    const activePage = document.querySelector('.page.active');
    if (activePage.id !== 'mainPage') {
        showMain();
    }
});

// ===========================
// Settings Management
// ===========================
function loadSettings() {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
        userSettings = JSON.parse(saved);
        document.getElementById('notifications').checked = userSettings.notifications;
        document.getElementById('darkTheme').checked = userSettings.darkTheme;
        document.getElementById('sounds').checked = userSettings.sounds;
    }
}

function saveSettings() {
    userSettings.notifications = document.getElementById('notifications').checked;
    userSettings.darkTheme = document.getElementById('darkTheme').checked;
    userSettings.sounds = document.getElementById('sounds').checked;

    localStorage.setItem('userSettings', JSON.stringify(userSettings));

    // Apply theme
    applyTheme();

    // Show success popup using Telegram native popup
    tg.showPopup({
        title: 'Успешно!',
        message: 'Настройки успешно сохранены',
        buttons: [
            { id: 'ok', type: 'ok' }
        ]
    }, (buttonId) => {
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
    });

    // Hide MainButton after save
    tg.MainButton.hide();
}

function applyTheme() {
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

    if (userSettings.darkTheme) {
        document.body.style.setProperty('--tg-theme-bg-color', '#1a1a1a');
        document.body.style.setProperty('--tg-theme-text-color', '#ffffff');
        document.body.style.setProperty('--tg-theme-secondary-bg-color', '#2a2a2a');
        document.body.style.setProperty('--tg-theme-hint-color', '#aaaaaa');
    } else {
        // Use Telegram theme colors
        const params = tg.themeParams;
        if (params.bg_color) {
            document.body.style.setProperty('--tg-theme-bg-color', params.bg_color);
        }
        if (params.text_color) {
            document.body.style.setProperty('--tg-theme-text-color', params.text_color);
        }
        if (params.secondary_bg_color) {
            document.body.style.setProperty('--tg-theme-secondary-bg-color', params.secondary_bg_color);
        }
        if (params.hint_color) {
            document.body.style.setProperty('--tg-theme-hint-color', params.hint_color);
        }
    }
}

// ===========================
// User Initialization
// ===========================
function init() {
    const user = tg.initDataUnsafe?.user;

    if (user) {
        const userName = user.first_name + (user.last_name ? ' ' + user.last_name : '');
        const username = user.username ? '@' + user.username : 'Нет username';

        // Main page
        document.getElementById('userName').textContent = userName;
        document.getElementById('userInfo').textContent = username;

        // Profile page
        document.getElementById('profileName').textContent = userName;
        document.getElementById('profileUsername').textContent = username;
        document.getElementById('profileId').textContent = user.id;
        document.getElementById('profileLang').textContent = user.language_code?.toUpperCase() || 'RU';
    } else {
        // Test data for development
        document.getElementById('userName').textContent = 'Тестовый пользователь';
        document.getElementById('userInfo').textContent = '@testuser';
        document.getElementById('profileName').textContent = 'Тестовый пользователь';
        document.getElementById('profileUsername').textContent = '@testuser';
        document.getElementById('profileId').textContent = '123456789';
        document.getElementById('profileLang').textContent = 'RU';
    }

    loadSettings();
    animateOnScroll();
    setupMainButton();
    startPromoTimer();
}

// ===========================
// Page Navigation
// ===========================
function showPage(pageId) {
    const currentPage = document.querySelector('.page.active');
    const nextPage = document.getElementById(pageId);

    if (currentPage === nextPage) return;

    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }

    // Page transition
    if (currentPage) {
        currentPage.style.animation = 'slideOut 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';

        setTimeout(() => {
            currentPage.classList.remove('active');
            currentPage.style.animation = '';
            nextPage.classList.add('active');

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 300);
    } else {
        nextPage.classList.add('active');
    }

    // Manage BackButton and MainButton
    if (pageId === 'mainPage') {
        tg.BackButton.hide();
        tg.MainButton.hide();
    } else {
        tg.BackButton.show();

        if (pageId === 'settingsPage') {
            tg.MainButton.show();
        } else {
            tg.MainButton.hide();
        }
    }
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-30px);
        }
    }
`;
document.head.appendChild(style);

function showMain() {
    showPage('mainPage');
}

function showProfile() {
    showPage('profilePage');
}

function showSettings() {
    showPage('settingsPage');
}

function showAbout() {
    showPage('aboutPage');
}

// ===========================
// Burger King Modal Functions
// ===========================
function showPromoModal() {
    const modal = document.getElementById('promoModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

function closePromoModal() {
    const modal = document.getElementById('promoModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';

    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

function copyPromoCode() {
    const promoCode = document.getElementById('promoCodeText').textContent;

    // Try to use Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(promoCode).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopyTextToClipboard(promoCode);
        });
    } else {
        fallbackCopyTextToClipboard(promoCode);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('Failed to copy:', err);
    }

    document.body.removeChild(textArea);
}

function showCopySuccess() {
    tg.showPopup({
        title: 'Скопировано!',
        message: 'Промокод скопирован в буфер обмена',
        buttons: [{ id: 'ok', type: 'ok' }]
    });

    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
}

function activatePromo() {
    tg.showPopup({
        title: 'Подтверждение',
        message: 'Активировать специальное предложение со скидкой 30%?',
        buttons: [
            { id: 'cancel', type: 'cancel' },
            { id: 'activate', type: 'default', text: 'Активировать' }
        ]
    }, (buttonId) => {
        if (buttonId === 'activate') {
            if (tg.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred('success');
            }

            tg.showAlert('Поздравляем! Промокод WELCOME30 активирован. Используйте его при следующем заказе.');
            closePromoModal();

            // Send event to bot (if needed)
            tg.sendData(JSON.stringify({
                action: 'promo_activated',
                code: 'WELCOME30',
                timestamp: Date.now()
            }));
        }
    });

    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// Promo timer
let promoTimeLeft = 86385; // 23:59:45 in seconds

function startPromoTimer() {
    updateTimerDisplay();
    setInterval(() => {
        if (promoTimeLeft > 0) {
            promoTimeLeft--;
            updateTimerDisplay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const hours = Math.floor(promoTimeLeft / 3600);
    const minutes = Math.floor((promoTimeLeft % 3600) / 60);
    const seconds = promoTimeLeft % 60;

    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const timerElement = document.getElementById('timerText');
    if (timerElement) {
        timerElement.textContent = timeString;
    }
}

// ===========================
// Scroll Animations
// ===========================
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    const elementsToAnimate = document.querySelectorAll('.menu-item, .stat-card, .info-row, .setting-item, .feature-item');
    elementsToAnimate.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

const fadeInUpStyle = document.createElement('style');
fadeInUpStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(fadeInUpStyle);

// ===========================
// Event Listeners
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    init();
    applyTheme();

    // Haptic feedback for interactive elements
    const interactiveElements = document.querySelectorAll('.menu-item, .stat-card, .back-btn, .primary-btn');
    interactiveElements.forEach(element => {
        element.addEventListener('click', () => {
            if (tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('light');
            }
        });
    });

    // Haptic feedback for toggles
    const toggles = document.querySelectorAll('.toggle input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            if (tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('medium');
            }

            // Show MainButton when settings change
            if (tg.MainButton && document.querySelector('.page.active').id === 'settingsPage') {
                tg.MainButton.show();
            }
        });
    });

    // Avatar parallax effect
    const avatar = document.querySelector('.avatar');
    if (avatar) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            avatar.style.transform = `scale(${1 + scrolled * 0.0005}) translateY(${scrolled * 0.1}px)`;
        });
    }
});

// Tell Telegram that the app is ready
tg.ready();

// ===========================
// Telegram theme change listener
// ===========================
tg.onEvent('themeChanged', () => {
    applyTheme();
});

// ===========================
// Viewport change handler
// ===========================
tg.onEvent('viewportChanged', (event) => {
    console.log('Viewport changed:', event);
    if (event.isStateStable) {
        // Adjust layout if needed
    }
});

// ===========================
// Cloud Storage Example (optional)
// ===========================
function saveToCloud(key, value) {
    if (tg.CloudStorage) {
        tg.CloudStorage.setItem(key, value, (error, success) => {
            if (error) {
                console.error('Cloud storage error:', error);
            } else {
                console.log('Saved to cloud:', key);
            }
        });
    }
}

function loadFromCloud(key, callback) {
    if (tg.CloudStorage) {
        tg.CloudStorage.getItem(key, (error, value) => {
            if (error) {
                console.error('Cloud storage error:', error);
            } else {
                callback(value);
            }
        });
    }
}

// ===========================
// Pull-to-refresh prevention
// ===========================
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const touchDiff = touchY - touchStartY;

    if (touchDiff > 0 && window.scrollY === 0) {
        e.preventDefault();
    }
}, { passive: false });