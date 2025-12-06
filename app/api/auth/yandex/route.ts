import { NextResponse } from "next/server"

export async function GET() {
  // Yandex OAuth credentials - need to be added as env vars
  const clientId = process.env.YANDEX_CLIENT_ID

  if (!clientId) {
    return NextResponse.json(
      { error: "Yandex OAuth не настроен. Добавьте YANDEX_CLIENT_ID в переменные окружения." },
      { status: 500 },
    )
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/yandex/callback`

  const authUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`

  return NextResponse.redirect(authUrl)
}
