# Настройка Яндекс OAuth для TG Export

## Шаг 1: Создание приложения в Яндекс ID

1. Перейдите на https://oauth.yandex.ru/client/new
2. Заполните форму создания приложения:

### Основная информация:
- **Название**: TG Export (или любое другое)
- **Описание**: Сервис для экспорта участников Telegram групп
- **Иконка**: (необязательно)

### Callback URLs (Redirect URI):

#### Для production (после деплоя на Vercel):
\`\`\`
https://ваш-домен.vercel.app/api/auth/yandex/callback
\`\`\`

#### Для локальной разработки:
\`\`\`
http://localhost:3000/api/auth/yandex/callback
\`\`\`

**ВАЖНО:** Добавьте ОБА URL если планируете разработку!

### Платформы и хосты:

#### Для production:
\`\`\`
https://ваш-домен.vercel.app
\`\`\`

#### Для локальной разработки:
\`\`\`
http://localhost:3000
\`\`\`

### Права доступа (Permissions):
Выберите следующие права:
- ✅ **Доступ к логину, имени и фамилии, полу**
- ✅ **Доступ к адресу электронной почты**

## Шаг 2: Получение учетных данных

После создания приложения вы получите:
- **Client ID** (ID приложения)
- **Client Secret** (Секрет приложения)

## Шаг 3: Добавление переменных окружения

### В локальной разработке (.env.local):
\`\`\`env
YANDEX_CLIENT_ID=ваш_client_id
YANDEX_CLIENT_SECRET=ваш_client_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### В Vercel (Production):
1. Откройте Settings → Environment Variables
2. Добавьте следующие переменные:

\`\`\`
YANDEX_CLIENT_ID = ваш_client_id
YANDEX_CLIENT_SECRET = ваш_client_secret
NEXT_PUBLIC_APP_URL = https://ваш-домен.vercel.app
\`\`\`

## Шаг 4: Telegram API настройки

### Получение Telegram API ключей:

1. Перейдите на https://my.telegram.org
2. Войдите с помощью номера телефона
3. Перейдите в "API development tools"
4. Создайте новое приложение:
   - **App title**: TG Export
   - **Short name**: tgexport
   - **Platform**: Other
   - **Description**: Telegram group members export tool

5. Скопируйте:
   - **api_id** (например: 12345678)
   - **api_hash** (например: 0123456789abcdef0123456789abcdef)

6. Введите эти данные в дашборде в разделе "Настройки"

## Примеры URL в зависимости от окружения

### Development (localhost):
- Redirect URI: `http://localhost:3000/api/auth/yandex/callback`
- Host: `http://localhost:3000`
- NEXT_PUBLIC_APP_URL: `http://localhost:3000`

### Production (Vercel):
- Redirect URI: `https://tg-export.vercel.app/api/auth/yandex/callback`
- Host: `https://tg-export.vercel.app`
- NEXT_PUBLIC_APP_URL: `https://tg-export.vercel.app`

## Проверка настройки

После настройки:
1. Откройте страницу логина: `/auth/login`
2. Нажмите "Войти через Яндекс"
3. Вы должны быть перенаправлены на Яндекс для авторизации
4. После авторизации вы вернетесь в дашборд

## Возможные ошибки

### "yandex_auth_failed"
- Проверьте, что YANDEX_CLIENT_ID и YANDEX_CLIENT_SECRET добавлены в переменные окружения
- Убедитесь, что Redirect URI точно совпадает

### "yandex_callback_failed"  
- Проверьте правильность Client ID и Client Secret
- Убедитесь, что выбраны правильные права доступа в приложении

### Не работает кнопка "Войти через Яндекс"
- Проверьте, что NEXT_PUBLIC_APP_URL установлен правильно
- Убедитесь, что хост страницы добавлен в настройках приложения
