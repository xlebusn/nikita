import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApiSettingsGuide } from "@/components/api-settings-guide"
import { YandexOAuthInfo } from "@/components/yandex-oauth-info"

export default async function SetupPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Инструкции по настройке</h1>
        <p className="text-muted-foreground">Полная информация для настройки сервиса</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Настройка Telegram API</CardTitle>
            <CardDescription>Получите ключи для работы с Telegram</CardDescription>
          </CardHeader>
          <CardContent>
            <ApiSettingsGuide />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Настройка Яндекс OAuth (опционально)</CardTitle>
            <CardDescription>Для использования входа через Яндекс</CardDescription>
          </CardHeader>
          <CardContent>
            <YandexOAuthInfo />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Переменные окружения</CardTitle>
            <CardDescription>Необходимые переменные для работы сервиса</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <strong>Обязательные (Supabase):</strong>
                <ul className="ml-6 mt-2 list-disc space-y-1 text-muted-foreground">
                  <li>SUPABASE_URL</li>
                  <li>NEXT_PUBLIC_SUPABASE_URL</li>
                  <li>SUPABASE_ANON_KEY</li>
                  <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  <li>SUPABASE_SERVICE_ROLE_KEY</li>
                </ul>
              </div>
              <div>
                <strong>Для Яндекс OAuth:</strong>
                <ul className="ml-6 mt-2 list-disc space-y-1 text-muted-foreground">
                  <li>YANDEX_CLIENT_ID</li>
                  <li>YANDEX_CLIENT_SECRET</li>
                  <li>NEXT_PUBLIC_APP_URL</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
