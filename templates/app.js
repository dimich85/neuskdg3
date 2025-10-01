// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;

// Расширяем приложение на весь экран
tg.expand();

// Включаем кнопку "Назад" в Telegram
tg.BackButton.onClick(() => {
    const activePage = document.querySelector('.page.active');
    if (activePage.id !== 'mainPage') {
        showMain();
    }
});

// Настройки пользователя
let userSettings = {
    notifications: true,
    darkTheme: false,
    sounds: true
};

// Загрузка настроек из localStorage
function loadSettings() {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
        userSettings = JSON.parse(saved);
        document.getElementById('notifications').checked = userSettings.notifications;
        document.getElementById('darkTheme').checked = userSettings.darkTheme;
        document.getElementById('sounds').checked = userSettings.sounds;
    }
}

// Инициализация приложения
function init() {
    // Получаем данные пользователя из Telegram
    const user = tg.initDataUnsafe?.user;

    if (user) {
        const userName = user.first_name + (user.last_name ? ' ' + user.last_name : '');
        const username = user.username ? '@' + user.username : 'Нет username';

        // Главная страница
        document.getElementById('userName').textContent = userName;
        document.getElementById('userInfo').textContent = username;

        // Страница профиля
        document.getElementById('profileName').textContent = userName;
        document.getElementById('profileUsername').textContent = username;
        document.getElementById('profileId').textContent = user.id;
        document.getElementById('profileLang').textContent = user.language_code?.toUpperCase() || 'RU';
    } else {
        // Тестовые данные для разработки
        document.getElementById('userName').textContent = 'Тестовый пользователь';
        document.getElementById('userInfo').textContent = '@testuser';
        document.getElementById('profileName').textContent = 'Тестовый пользователь';
        document.getElementById('profileUsername').textContent = '@testuser';
        document.getElementById('profileId').textContent = '123456789';
        document.getElementById('profileLang').textContent = 'RU';
    }

    // Загружаем настройки
    loadSettings();

    // Добавляем эффект появления элементов
    animateOnScroll();
}

// Навигация между страницами с плавными переходами
function showPage(pageId) {
    const currentPage = document.querySelector('.page.active');
    const nextPage = document.getElementById(pageId);

    if (currentPage === nextPage) return;

    // Анимация исчезновения текущей страницы
    if (currentPage) {
        currentPage.style.animation = 'slideOut 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';

        setTimeout(() => {
            currentPage.classList.remove('active');
            currentPage.style.animation = '';

            // Анимация появления новой страницы
            nextPage.classList.add('active');

            // Плавная прокрутка наверх
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 300);
    } else {
        nextPage.classList.add('active');
    }

    // Управление кнопкой "Назад" в Telegram
    if (pageId === 'mainPage') {
        tg.BackButton.hide();
    } else {
        tg.BackButton.show();
    }

    // Добавляем вибрацию при переходе (если поддерживается)
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// Добавляем анимацию выхода
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

// Сохранение настроек с анимацией
function saveSettings() {
    const button = document.querySelector('.primary-btn');
    const originalText = button.innerHTML;

    // Анимация загрузки
    button.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite;"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/><path d="M10 2C5.58172 2 2 5.58172 2 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Сохранение...';
    button.style.pointerEvents = 'none';

    setTimeout(() => {
        userSettings.notifications = document.getElementById('notifications').checked;
        userSettings.darkTheme = document.getElementById('darkTheme').checked;
        userSettings.sounds = document.getElementById('sounds').checked;

        localStorage.setItem('userSettings', JSON.stringify(userSettings));

        // Применяем тему
        applyTheme();

        // Возвращаем кнопку в исходное состояние
        button.innerHTML = originalText;
        button.style.pointerEvents = 'auto';

        // Показываем уведомление
        tg.showAlert('Настройки успешно сохранены!');

        // Вибрация успеха
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
    }, 800);
}

// Добавляем анимацию вращения для загрузки
const spinStyle = document.createElement('style');
spinStyle.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(spinStyle);

// Применение темы с плавным переходом
function applyTheme() {
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

    if (userSettings.darkTheme) {
        document.body.style.setProperty('--tg-theme-bg-color', '#1a1a1a');
        document.body.style.setProperty('--tg-theme-text-color', '#ffffff');
        document.body.style.setProperty('--tg-theme-secondary-bg-color', '#2a2a2a');
        document.body.style.setProperty('--tg-theme-hint-color', '#aaaaaa');
    } else {
        document.body.style.removeProperty('--tg-theme-bg-color');
        document.body.style.removeProperty('--tg-theme-text-color');
        document.body.style.removeProperty('--tg-theme-secondary-bg-color');
        document.body.style.removeProperty('--tg-theme-hint-color');
    }
}

// Анимация элементов при прокрутке
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

    // Наблюдаем за элементами
    const elementsToAnimate = document.querySelectorAll('.menu-item, .stat-card, .info-row, .setting-item, .feature-item');
    elementsToAnimate.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// Добавляем анимацию появления снизу
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

// Добавляем тактильные отклики для всех интерактивных элементов
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация
    init();
    applyTheme();

    // Добавляем вибрацию для кликов по элементам меню
    const interactiveElements = document.querySelectorAll('.menu-item, .stat-card, .back-btn, .primary-btn');
    interactiveElements.forEach(element => {
        element.addEventListener('click', () => {
            if (tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('light');
            }
        });
    });

    // Добавляем вибрацию для переключателей
    const toggles = document.querySelectorAll('.toggle input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            if (tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('medium');
            }
        });
    });

    // Эффект параллакса для аватара (опционально)
    const avatar = document.querySelector('.avatar');
    if (avatar) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            avatar.style.transform = `scale(${1 + scrolled * 0.0005}) translateY(${scrolled * 0.1}px)`;
        });
    }
});

// Устанавливаем цвета темы из Telegram
tg.ready();

// Предотвращение стандартного поведения pull-to-refresh (опционально)
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