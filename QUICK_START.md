# Быстрый старт TG Export

## Что вставить в Яндекс OAuth:

### 1. Redirect URI (URL для перенаправления):
**Для production:**
\`\`\`
https://ваш-домен.vercel.app/api/auth/yandex/callback
\`\`\`

**Для разработки:**
\`\`\`
http://localhost:3000/api/auth/yandex/callback
\`\`\`

### 2. Хост страницы:
**Для production:**
\`\`\`
https://ваш-домен.vercel.app
\`\`\`

**Для разработки:**
\`\`\`
http://localhost:3000
\`\`\`

---

## Что вставить в переменные окружения Vercel:

1. Откройте ваш проект на Vercel
2. Settings → Environment Variables
3. Добавьте:

\`\`\`
YANDEX_CLIENT_ID = [ваш Client ID из Яндекс OAuth]
YANDEX_CLIENT_SECRET = [ваш Client Secret из Яндекс OAuth]
NEXT_PUBLIC_APP_URL = https://ваш-домен.vercel.app
\`\`\`

---

## Telegram API ключи

После деплоя:
1. Откройте ваш сайт
2. Войдите через email или Яндекс
3. Перейдите во вкладку "Настройки"
4. Следуйте инструкциям на странице
5. Получите API ID и API Hash на https://my.telegram.org
6. Вставьте их в форму и сохраните

---

## Порядок действий:

1. ✅ Запустите SQL скрипты из папки `scripts/` (через Supabase Dashboard или v0)
2. ✅ Создайте приложение на https://oauth.yandex.ru/client/new
3. ✅ Добавьте переменные окружения в Vercel
4. ✅ Задеплойте на Vercel
5. ✅ Откройте сайт и войдите
6. ✅ Настройте Telegram API в дашборде
7. ✅ Готово! Можете экспортировать участников

---

## Примеры готовых URL:

Если ваш домен: `tg-export.vercel.app`

**Redirect URI:**
\`\`\`
https://tg-export.vercel.app/api/auth/yandex/callback
\`\`\`

**Хост:**
\`\`\`
https://tg-export.vercel.app
\`\`\`

**NEXT_PUBLIC_APP_URL:**
\`\`\`
https://tg-export.vercel.app
