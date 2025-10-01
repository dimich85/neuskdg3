from flask import Flask, render_template, request, jsonify
import hmac
import hashlib
import json
from urllib.parse import parse_qsl

app = Flask(__name__)

# Замените на токен вашего бота
BOT_TOKEN = "6933094335:AAGT_DNq1EUSzb9PlWwjFeulF4NIT_tGbrk"

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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)