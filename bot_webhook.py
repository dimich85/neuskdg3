import asyncio
import logging
import sys
import os
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.webhook.aiohttp_server import SimpleRequestHandler, setup_application
from aiohttp import web

# Настройка кодировки для Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Получаем токен и URL из переменных окружения
BOT_TOKEN = os.environ.get('BOT_TOKEN', "6933094335:AAGT_DNq1EUSzb9PlWwjFeulF4NIT_tGbrk")
WEB_APP_URL = os.environ.get('WEB_APP_URL', "https://your-app.vercel.app")
WEBHOOK_PATH = os.environ.get('WEBHOOK_PATH', '/webhook')
WEBHOOK_URL = os.environ.get('WEBHOOK_URL', '')  # Полный URL вебхука

# Инициализация бота
bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher()

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


async def on_startup():
    """Действия при запуске бота"""
    if WEBHOOK_URL:
        await bot.set_webhook(WEBHOOK_URL, drop_pending_updates=True)
        logging.info(f"Webhook установлен: {WEBHOOK_URL}")
    else:
        logging.warning("WEBHOOK_URL не установлен!")


async def on_shutdown():
    """Действия при остановке бота"""
    await bot.delete_webhook()
    logging.info("Webhook удален")


def main():
    """Главная функция для запуска бота через webhook"""
    # Создаем приложение aiohttp
    app = web.Application()

    # Устанавливаем webhook handler
    webhook_handler = SimpleRequestHandler(
        dispatcher=dp,
        bot=bot
    )
    webhook_handler.register(app, path=WEBHOOK_PATH)

    # Настраиваем startup/shutdown обработчики
    setup_application(app, dp, bot=bot)

    # Запускаем при старте
    app.on_startup.append(lambda app: asyncio.create_task(on_startup()))
    app.on_shutdown.append(lambda app: asyncio.create_task(on_shutdown()))

    # Запуск сервера
    web.run_app(app, host='0.0.0.0', port=8080)


if __name__ == '__main__':
    print("🤖 Запуск Telegram бота в режиме webhook...")
    main()