from flask import Flask, render_template, request, jsonify
import hmac
import hashlib
import json
from urllib.parse import parse_qsl
import asyncio
import threading
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
import logging
import sys

# Настройка кодировки для Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = Flask(__name__)

# Замените на токен вашего бота
BOT_TOKEN = "6933094335:AAGT_DNq1EUSzb9PlWwjFeulF4NIT_tGbrk"

# URL вашего WebApp (для локального тестирования используйте ngrok)
# Например: "https://abc123.ngrok.io" или "http://localhost:5000" для разработки

# Инициализация бота
bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher()

def validate_telegram_data(init_data: str) -> dict:
    """Проверяет и валидирует данные от Telegram WebApp"""
    try:
        parsed_data = dict(parse_qsl(init_data))

        # Получаем hash из данных
        received_hash = parsed_data.pop('hash', None)
        if not received_hash:
            return None

        # Создаем строку для проверки
        data_check_string = '\n'.join([f"{k}={v}" for k, v in sorted(parsed_data.items())])

        # Создаем секретный ключ
        secret_key = hmac.new(
            key=b"WebAppData",
            msg=BOT_TOKEN.encode(),
            digestmod=hashlib.sha256
        ).digest()

        # Вычисляем hash
        calculated_hash = hmac.new(
            key=secret_key,
            msg=data_check_string.encode(),
            digestmod=hashlib.sha256
        ).hexdigest()

        # Проверяем совпадение
        if calculated_hash != received_hash:
            return None

        # Парсим данные пользователя
        if 'user' in parsed_data:
            parsed_data['user'] = json.loads(parsed_data['user'])

        return parsed_data
    except Exception as e:
        print(f"Validation error: {e}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/auth', methods=['POST'])
def authenticate():
    """Эндпоинт для аутентификации пользователя"""
    data = request.json
    init_data = data.get('initData')

    if not init_data:
        return jsonify({'error': 'No init data provided'}), 400

    validated_data = validate_telegram_data(init_data)

    if not validated_data:
        return jsonify({'error': 'Invalid authentication data'}), 401

    user_data = validated_data.get('user', {})

    return jsonify({
        'success': True,
        'user': {
            'id': user_data.get('id'),
            'first_name': user_data.get('first_name'),
            'last_name': user_data.get('last_name'),
            'username': user_data.get('username'),
            'language_code': user_data.get('language_code'),
            'is_premium': user_data.get('is_premium', False),
            'photo_url': user_data.get('photo_url')
        }
    })


# ========== Обработчики Telegram бота ==========

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    """Обработчик команды /start"""
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🚀 Открыть приложение",
                    web_app=WebAppInfo(url=WEB_APP_URL)
                )
            ]
        ]
    )

    await message.answer(
        f"👋 Привет, <b>{message.from_user.first_name}</b>!\n\n"
        f"Нажми на кнопку ниже, чтобы открыть WebApp профиль:",
        reply_markup=keyboard
    )


@dp.message(Command("help"))
async def cmd_help(message: types.Message):
    """Обработчик команды /help"""
    await message.answer(
        "📖 <b>Доступные команды:</b>\n\n"
        "/start - Открыть WebApp\n"
        "/help - Показать это сообщение\n"
        "/app - Открыть приложение"
    )


@dp.message(Command("app"))
async def cmd_app(message: types.Message):
    """Обработчик команды /app"""
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🚀 Открыть приложение",
                    web_app=WebAppInfo(url=WEB_APP_URL)
                )
            ]
        ]
    )

    await message.answer(
        "Нажми на кнопку для запуска приложения:",
        reply_markup=keyboard
    )


@dp.message()
async def echo_message(message: types.Message):
    """Обработчик всех остальных сообщений"""
    await message.answer(
        f"Используй команду /start для запуска приложения"
    )


# ========== Запуск бота и сервера ==========

async def start_bot():
    """Запускает Telegram бота"""
    print("🤖 Telegram бот запущен...")
    await dp.start_polling(bot)


def run_flask():
    """Запускает Flask сервер"""
    print("🌐 Flask сервер запущен на http://localhost:5000")
    app.run(debug=False, host='0.0.0.0', port=5000, use_reloader=False)


def main():
    """Главная функция - запускает Flask и бота одновременно"""
    print("=" * 50)
    print("🚀 Запуск Telegram WebApp")
    print("=" * 50)

    # Запускаем Flask в отдельном потоке
    flask_thread = threading.Thread(target=run_flask, daemon=True)
    flask_thread.start()

    # Запускаем бота в основном потоке
    asyncio.run(start_bot())


if __name__ == '__main__':
    main()