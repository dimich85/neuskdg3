# Telegram WebApp на Flask

Telegram WebApp приложение для отображения профиля пользователя, развернутое на Vercel.

## Структура проекта

```
├── api/
│   └── index.py          # Flask приложение для Vercel serverless
├── templates/
│   └── index.html        # HTML шаблон WebApp
├── bot_webhook.py        # Telegram бот с webhook
├── telegram_webapp.py    # Локальный запуск (Flask + бот)
├── requirements.txt      # Зависимости Python
├── vercel.json          # Конфигурация Vercel
└── README.md
```

## Деплой на Vercel через GitHub

### Шаг 1: Подготовка GitHub репозитория

1. Создайте новый репозиторий на GitHub
2. Инициализируйте git и загрузите код:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ваш-username/ваш-репозиторий.git
git push -u origin main
```

### Шаг 2: Деплой на Vercel

1. Зайдите на [vercel.com](https://vercel.com) и войдите через GitHub
2. Нажмите "Add New" → "Project"
3. Выберите ваш GitHub репозиторий
4. Настройте Environment Variables:
   - `BOT_TOKEN` - токен вашего Telegram бота
5. Нажмите "Deploy"

### Шаг 3: Настройка Telegram бота

После успешного деплоя:

1. Скопируйте URL вашего приложения (например: `https://ваш-проект.vercel.app`)
2. Обновите `WEB_APP_URL` в настройках бота
3. Настройте WebApp в BotFather:
   - Отправьте `/mybots` в @BotFather
   - Выберите вашего бота
   - Bot Settings → Menu Button → Edit menu button URL
   - Вставьте URL: `https://ваш-проект.vercel.app`

### Шаг 4: Запуск бота

Для запуска бота используйте один из вариантов:

**Вариант A: Локально (для тестирования)**
```bash
python telegram_webapp.py
```

**Вариант B: На сервере с webhook**
```bash
# Установите переменные окружения:
export BOT_TOKEN="ваш-токен"
export WEB_APP_URL="https://ваш-проект.vercel.app"
export WEBHOOK_URL="https://ваш-сервер.com/webhook"

python bot_webhook.py
```

**Вариант C: На Railway/Render (рекомендуется для продакшена)**

1. Создайте аккаунт на [Railway](https://railway.app) или [Render](https://render.com)
2. Подключите GitHub репозиторий
3. Установите переменные окружения:
   - `BOT_TOKEN`
   - `WEB_APP_URL`
   - `WEBHOOK_URL`
4. Деплойте `bot_webhook.py`

## Environment Variables

| Переменная | Описание | Пример |
|-----------|----------|--------|
| `BOT_TOKEN` | Токен Telegram бота от @BotFather | `123456:ABC-DEF...` |
| `WEB_APP_URL` | URL вашего WebApp на Vercel | `https://app.vercel.app` |
| `WEBHOOK_URL` | URL webhook для бота (опционально) | `https://bot.com/webhook` |
| `WEBHOOK_PATH` | Путь для webhook (по умолчанию `/webhook`) | `/webhook` |

## Локальная разработка

```bash
# Установите зависимости
pip install -r requirements.txt

# Запустите приложение
python telegram_webapp.py
```

Приложение будет доступно по адресу `http://localhost:5000`

## Команды бота

- `/start` - Открыть WebApp приложение
- `/help` - Показать доступные команды
- `/app` - Открыть приложение

## Особенности

- ✅ Аутентификация через Telegram WebApp API
- ✅ Валидация данных пользователя
- ✅ Отображение профиля с аватаром
- ✅ Поддержка Telegram Premium статуса
- ✅ Адаптивный дизайн
- ✅ Serverless архитектура на Vercel

## Безопасность

⚠️ **ВАЖНО**: Не коммитьте токен бота в Git! Используйте переменные окружения.

Перед коммитом убедитесь, что:
- Токен хранится в Environment Variables на Vercel
- Файл `.env` добавлен в `.gitignore`

## Обновление после изменений

```bash
git add .
git commit -m "Описание изменений"
git push
```

Vercel автоматически задеплоит обновления.

## Полезные ссылки

- [Документация Telegram WebApp](https://core.telegram.org/bots/webapps)
- [Документация Vercel](https://vercel.com/docs)
- [Документация aiogram](https://docs.aiogram.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)