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
}

// Навигация между страницами
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    // Управление кнопкой "Назад" в Telegram
    if (pageId === 'mainPage') {
        tg.BackButton.hide();
    } else {
        tg.BackButton.show();
    }
}

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

// Сохранение настроек
function saveSettings() {
    userSettings.notifications = document.getElementById('notifications').checked;
    userSettings.darkTheme = document.getElementById('darkTheme').checked;
    userSettings.sounds = document.getElementById('sounds').checked;

    localStorage.setItem('userSettings', JSON.stringify(userSettings));

    // Показываем уведомление
    tg.showAlert('Настройки успешно сохранены!');

    // Опционально: применяем тёмную тему
    applyTheme();
}

// Применение темы
function applyTheme() {
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

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    init();
    applyTheme();
});

// Устанавливаем цвета темы из Telegram
tg.ready();