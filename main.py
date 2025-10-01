import logging
import sys
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
import asyncio

# Установка кодировки для вывода в консоль
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

# Замените на ваш токен бота
BOT_TOKEN = "6933094335:AAGT_DNq1EUSzb9PlWwjFeulF4NIT_tGbrk"

# Замените на URL вашего Web App (после деплоя)
WEB_APP_URL = "https://your-username.github.io/your-repo-name/"

# Инициализация бота
bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher()


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
        f"Нажми на кнопку ниже, чтобы открыть приложение:",
        reply_markup=keyboard
    )


@dp.message(Command("help"))
async def cmd_help(message: types.Message):
    """Обработчик команды /help"""
    await message.answer(
        "📖 <b>Доступные команды:</b>\n\n"
        "/start - Открыть приложение\n"
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


async def main():
    """Главная функция запуска бота"""
    print("Бот запущен и работает...")
    await dp.start_polling(bot)


if __name__ == '__main__':
    asyncio.run(main())