import asyncio
from telegram import Update, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes

# Замените на токен вашего бота
BOT_TOKEN = "YOUR_BOT_TOKEN_HERE"

# URL вашего WebApp (замените на ваш URL после деплоя)
WEBAPP_URL = "https://your-domain.com"  # или ngrok URL для тестирования

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Отправляет кнопку для открытия WebApp"""
    keyboard = [[{
        "text": "Открыть профиль",
        "web_app": {"url": WEBAPP_URL}
    }]]

    await update.message.reply_text(
        "Привет! Нажми на кнопку ниже, чтобы открыть WebApp:",
        reply_markup={"inline_keyboard": keyboard}
    )

def main():
    """Запускает бота"""
    application = Application.builder().token(BOT_TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()