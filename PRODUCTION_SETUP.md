# Production Setup Guide

Инструкция по развертыванию TG Export в production на Vercel.

## Предварительные требования

- ✅ Аккаунт на Vercel
- ✅ Настроенная интеграция Supabase
- ✅ GitHub репозиторий с кодом (опционально)

## Шаг 1: Подготовка Supabase

### 1.1 Выполнение SQL миграций

В v0 или в Supabase Dashboard выполните все SQL скрипты:

1. `scripts/001_create_tables.sql`
2. `scripts/002_create_profile_trigger.sql`
3. `scripts/003_reset_daily_limits.sql`

### 1.2 Настройка Email Templates (опционально)

В Supabase Dashboard → Authentication → Email Templates настройте:
- Confirm signup
- Reset password
- Magic link

## Шаг 2: Деплой на Vercel

### Вариант А: Прямо из v0

1. В v0 нажмите кнопку "Publish" в правом верхнем углу
2. Выберите Vercel проект или создайте новый
3. Подтвердите деплой

### Вариант Б: Через GitHub

1. Экспортируйте код из v0 (Download ZIP)
2. Загрузите в GitHub репозиторий
3. Подключите репозиторий к Vercel
4. Настройте переменные окружения (см. ниже)

## Шаг 3: Настройка переменных окружения в Vercel

### Обязательные переменные (Supabase)

Эти переменные должны быть уже настроены через интеграцию Supabase в v0:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_prisma_url
\`\`\`

### Добавьте дополнительные переменные:

В Vercel Dashboard → Settings → Environment Variables:

\`\`\`env
# Production App URL
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Yandex OAuth (если используете)
YANDEX_CLIENT_ID=your_yandex_client_id
YANDEX_CLIENT_SECRET=your_yandex_client_secret
\`\`\`

## Шаг 4: Настройка домена (опционально)

1. В Vercel Dashboard перейдите в Settings → Domains
2. Добавьте свой кастомный домен
3. Настройте DNS записи согласно инструкциям Vercel
4. Обновите `NEXT_PUBLIC_APP_URL` на новый домен

## Шаг 5: Настройка Supabase Redirect URLs

В Supabase Dashboard → Authentication → URL Configuration добавьте:

**Site URL:**
\`\`\`
https://your-domain.vercel.app
\`\`\`

**Redirect URLs:**
\`\`\`
https://your-domain.vercel.app/dashboard
https://your-domain.vercel.app/api/auth/yandex/callback
https://your-domain.vercel.app/*
\`\`\`

## Шаг 6: Настройка Яндекс OAuth (если используется)

См. файл `SETUP_YANDEX_OAUTH.md` для подробных инструкций.

Краткая версия:
1. Откройте приложение на https://oauth.yandex.ru
2. Добавьте production Redirect URI
3. Добавьте production хост

## Шаг 7: Интеграция с Telegram API (Python)

### Для полного функционала экспорта:

1. **Установите Python окружение** на вашем сервере или используйте Vercel Serverless Functions с Python Runtime

2. **Установите зависимости:**
\`\`\`bash
pip install telethon
\`\`\`

3. **Обновите API routes** для вызова Python скрипта:
   - `app/api/export/start/route.ts`
   - `app/api/export/phone/route.ts`
   - `app/api/export/verify/route.ts`

4. **Альтернатива**: Используйте отдельный Python микросервис:
   - Разверните `scripts/telegram_export.py` на отдельном сервере
   - Подключитесь к нему через HTTP API
   - Защитите API ключами

### Примечание:
Текущая версия использует mock данные для демонстрации. Для production нужна полная интеграция с Telethon.

## Шаг 8: Мониторинг и логирование

### Vercel Analytics
\`\`\`bash
npm i @vercel/analytics
\`\`\`

Добавьте в `app/layout.tsx`:
\`\`\`tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
\`\`\`

### Error Tracking (опционально)
- Sentry
- LogRocket
- Datadog

## Шаг 9: Настройка CRON для сброса лимитов

В Vercel Dashboard → Cron Jobs или используйте Supabase Edge Functions:

Создайте Edge Function:
\`\`\`sql
-- В Supabase SQL Editor
SELECT cron.schedule(
  'reset-daily-limits',
  '0 0 * * *', -- Каждый день в полночь
  $$
  UPDATE profiles
  SET daily_exports_used = 0,
      last_export_reset = NOW()
  WHERE last_export_reset < NOW() - INTERVAL '24 hours';
  $$
);
\`\`\`

## Шаг 10: Тестирование

### Checklist:
- [ ] Регистрация через email работает
- [ ] Подтверждение email приходит
- [ ] Вход через email работает
- [ ] Яндекс OAuth работает (если настроен)
- [ ] Настройки API сохраняются
- [ ] Интерфейс экспорта загружается
- [ ] История экспортов отображается
- [ ] Выход из аккаунта работает

### Тестирование производительности:
\`\`\`bash
# Используйте Lighthouse
npm install -g lighthouse
lighthouse https://your-domain.vercel.app --view
\`\`\`

## Шаг 11: Безопасность

### Rate Limiting
Добавьте rate limiting для API routes:
\`\`\`bash
npm install @upstash/ratelimit @upstash/redis
\`\`\`

### CORS настройки
Проверьте CORS в `next.config.mjs` если используете внешние API

### Environment Variables
- Никогда не коммитьте .env файлы
- Используйте Vercel Environment Variables
- Регулярно ротируйте секреты

## Полезные команды

### Проверка деплоя:
\`\`\`bash
vercel --prod
\`\`\`

### Откат к предыдущей версии:
В Vercel Dashboard → Deployments → выберите версию → Promote to Production

### Просмотр логов:
\`\`\`bash
vercel logs your-deployment-url
\`\`\`

## Troubleshooting

### 500 Internal Server Error
- Проверьте переменные окружения
- Проверьте логи в Vercel Dashboard
- Убедитесь, что Supabase подключен

### Supabase Auth не работает
- Проверьте Redirect URLs в Supabase
- Убедитесь, что NEXT_PUBLIC_SUPABASE_URL правильный
- Проверьте email подтверждение

### Яндекс OAuth не работает
- См. SETUP_YANDEX_OAUTH.md
- Проверьте Redirect URI
- Убедитесь, что Client ID и Secret правильные

## Поддержка

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
