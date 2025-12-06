export function YandexOAuthInfo() {
  return (
    <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
      <h3 className="mb-3 font-semibold text-primary">Настройка Яндекс OAuth</h3>
      <div className="space-y-3 text-sm">
        <div>
          <p className="mb-2 font-medium">При создании приложения в Яндекс ID укажите:</p>
          <div className="space-y-2">
            <div>
              <strong>Redirect URI (Callback URL):</strong>
              <code className="mt-1 block rounded bg-background p-2 text-xs">
                {typeof window !== "undefined" ? window.location.origin : "https://ваш-домен.vercel.app"}
                /api/auth/yandex/callback
              </code>
            </div>
            <div>
              <strong>Хост страницы (Origins):</strong>
              <code className="mt-1 block rounded bg-background p-2 text-xs">
                {typeof window !== "undefined" ? window.location.origin : "https://ваш-домен.vercel.app"}
              </code>
            </div>
          </div>
        </div>
        <div className="rounded bg-background p-2 text-xs text-muted-foreground">
          Создать приложение можно на{" "}
          <a
            href="https://oauth.yandex.ru/client/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            oauth.yandex.ru
          </a>
        </div>
      </div>
    </div>
  )
}
