# Настройка Яндекс OAuth для TG Export

Этот документ содержит пошаговую инструкцию для настройки Яндекс OAuth в вашем приложении.

## Шаг 1: Создание приложения в Яндекс ID

1. Перейдите на https://oauth.yandex.ru/client/new
2. Войдите в свой Яндекс аккаунт
3. Нажмите "Зарегистрировать новое приложение"

## Шаг 2: Заполнение данных приложения

### Основная информация:
- **Название приложения**: TG Export (или любое другое)
- **Описание**: Сервис для экспорта участников Telegram групп
- **Иконка**: Загрузите логотип (опционально)

### Платформы:
Выберите "Веб-сервисы"

### Callback URI (Redirect URI):

Для **разработки**:
\`\`\`
http://localhost:3000/api/auth/yandex/callback
\`\`\`

Для **production** (после деплоя на Vercel):
\`\`\`
https://your-domain.vercel.app/api/auth/yandex/callback
\`\`\`

**Важно**: Замените `your-domain` на реальный домен вашего приложения

### Хост страницы с кнопкой авторизации:

Для **разработки**:
\`\`\`
http://localhost:3000
\`\`\`

Для **production**:
\`\`\`
https://your-domain.vercel.app
\`\`\`

### Доступы:
Выберите минимально необходимые права:
- ✅ Доступ к email адресу
- ✅ Доступ к имени пользователя

## Шаг 3: Получение Client ID и Client Secret

После создания приложения вы получите:
- **ID приложения (Client ID)** - публичный идентификатор
- **Пароль приложения (Client Secret)** - секретный ключ

**Сохраните эти данные!** Они понадобятся для настройки переменных окружения.

## Шаг 4: Настройка переменных окружения

### Локальная разработка

Создайте файл `.env.local` в корне проекта:

\`\`\`env
# Yandex OAuth
YANDEX_CLIENT_ID=ваш_client_id
YANDEX_CLIENT_SECRET=ваш_client_secret

# App URL для локальной разработки
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### Production (Vercel)

1. Откройте проект в Vercel Dashboard
2. Перейдите в Settings → Environment Variables
3. Добавьте переменные:

| Название | Значение | Environments |
|----------|----------|--------------|
| `YANDEX_CLIENT_ID` | ваш_client_id | Production, Preview |
| `YANDEX_CLIENT_SECRET` | ваш_client_secret | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | https://your-domain.vercel.app | Production |
| `NEXT_PUBLIC_APP_URL` | https://your-preview.vercel.app | Preview |

## Шаг 5: Обновление Redirect URI после деплоя

После деплоя на Vercel:

1. Вернитесь в https://oauth.yandex.ru
2. Откройте ваше приложение
3. Добавьте production Redirect URI:
   \`\`\`
   https://your-domain.vercel.app/api/auth/yandex/callback
   \`\`\`
4. Добавьте production хост:
   \`\`\`
   https://your-domain.vercel.app
   \`\`\`

## Шаг 6: Тестирование

### Локально:
\`\`\`bash
npm run dev
\`\`\`
Откройте http://localhost:3000/auth/login и нажмите "Войти через Яндекс"

### Production:
После деплоя откройте ваш домен и проверьте вход через Яндекс

## Возможные проблемы

### Ошибка: "Invalid redirect_uri"
**Решение**: Убедитесь, что Redirect URI в настройках Яндекс OAuth точно совпадает с тем, что используется в приложении

### Ошибка: "Application is not found"
**Решение**: Проверьте правильность YANDEX_CLIENT_ID

### Ошибка: "Invalid client credentials"
**Решение**: Проверьте правильность YANDEX_CLIENT_SECRET

## Дополнительная информация

### Срок действия токенов:
- Access Token: 1 год
- Обновление автоматическое через Supabase Auth

### Безопасность:
- Client Secret никогда не передается на клиент
- Все операции с токенами происходят на сервере
- Используйте HTTPS в production

## Полезные ссылки

- [Документация Яндекс OAuth](https://yandex.ru/dev/id/doc/ru/)
- [Консоль приложений](https://oauth.yandex.ru/)
- [Тестирование OAuth](https://oauth.yandex.ru/verification_code)

## Поддержка

Если возникли проблемы с настройкой:
1. Проверьте все URL (они должны быть точными)
2. Убедитесь, что переменные окружения установлены
3. Перезапустите dev сервер после изменения .env.local
4. Проверьте логи в консоли браузера и терминале
