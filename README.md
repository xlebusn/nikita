# TG Export - Экспорт участников Telegram групп

Веб-сервис для экспорта списка участников из закрытых Telegram групп.

## Возможности

- Регистрация через email или Яндекс ID
- Экспорт участников Telegram групп через API
- Бесплатно 1 экспорт в сутки
- Экспорт результатов в CSV формат
- История всех экспортов
- Безопасное хранение данных с Row Level Security

## Технологии

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI**: Tailwind CSS v4, shadcn/ui
- **Backend**: Next.js API Routes, Python (Telethon)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth, Яндекс OAuth

## Установка

### 1. Клонирование и установка зависимостей

\`\`\`bash
npm install
\`\`\`

### 2. Настройка переменных окружения

Создайте файл `.env.local` и добавьте следующие переменные:

\`\`\`env
# Supabase (уже настроено в v0)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Яндекс OAuth (опционально)
YANDEX_CLIENT_ID=your_yandex_client_id
YANDEX_CLIENT_SECRET=your_yandex_client_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase redirect URL для разработки
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
\`\`\`

### 3. Создание таблиц в Supabase

В v0 выполните SQL скрипты из папки `scripts/`:

1. `001_create_tables.sql` - создание таблиц
2. `002_create_profile_trigger.sql` - триггер для профилей
3. `003_reset_daily_limits.sql` - функция сброса лимитов

### 4. Настройка Яндекс OAuth (опционально)

Если хотите использовать вход через Яндекс ID:

1. Перейдите на https://oauth.yandex.ru/client/new
2. Создайте новое приложение
3. Добавьте Redirect URI: `http://localhost:3000/api/auth/yandex/callback`
4. Добавьте хост страницы: `http://localhost:3000`
5. Скопируйте Client ID и Client Secret в `.env.local`

### 5. Настройка Telegram API (для production)

Для работы экспорта в production необходимо:

1. Установить Python и Telethon:
\`\`\`bash
pip install telethon
\`\`\`

2. Интегрировать Python скрипт `scripts/telegram_export.py` с API routes

**Примечание**: В текущей версии экспорт использует mock данные. Для полной функциональности требуется настройка Python окружения и интеграция с Telethon.

## Запуск

\`\`\`bash
npm run dev
\`\`\`

Откройте http://localhost:3000 в браузере.

## Структура проекта

\`\`\`
.
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Аутентификация
│   │   ├── export/       # Экспорт участников
│   │   └── settings/     # Настройки профиля
│   ├── auth/             # Страницы авторизации
│   ├── dashboard/        # Личный кабинет
│   ├── layout.tsx
│   └── page.tsx          # Лендинг
├── components/
│   ├── ui/               # UI компоненты
│   └── dashboard-client.tsx
├── lib/
│   └── supabase/         # Supabase клиенты
├── scripts/              # SQL скрипты и Python
└── proxy.ts              # Middleware
\`\`\`

## Использование

### Для пользователей

1. Зарегистрируйтесь через email или Яндекс ID
2. Получите API ключи от Telegram:
   - Перейдите на https://my.telegram.org
   - Войдите с вашим номером телефона
   - Создайте приложение в "API development tools"
   - Скопируйте API ID и API Hash
3. Вставьте ключи в настройках дашборда
4. Введите название группы и начните экспорт
5. Скачайте результаты в CSV

### Лимиты

- Бесплатно: 1 экспорт в сутки
- Неограниченное количество участников в группе
- История всех экспортов

## Безопасность

- Row Level Security (RLS) защищает данные пользователей
- API ключи шифруются при хранении
- Сессии управляются через Supabase Auth
- Middleware защищает приватные маршруты

## Production Deployment

### Vercel (рекомендуется)

1. Подключите репозиторий к Vercel
2. Добавьте переменные окружения
3. Настройте Supabase интеграцию
4. Деплой

### Дополнительные настройки для production

- Настройте домен и обновите `NEXT_PUBLIC_APP_URL`
- Настройте email провайдера в Supabase
- Добавьте мониторинг и логирование
- Настройте Python окружение для Telethon

## Известные ограничения

- Текущая версия использует mock данные для экспорта
- Требуется Python окружение для полной интеграции с Telegram
- Яндекс OAuth опционален

## Поддержка

Для вопросов и проблем создайте issue в репозитории.

## Лицензия

MIT
