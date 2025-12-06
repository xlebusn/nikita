import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Get profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (!profile) {
      return NextResponse.json({ error: "Профиль не найден" }, { status: 404 })
    }

    // Check API credentials
    if (!profile.api_id || !profile.api_hash) {
      return NextResponse.json(
        {
          error: 'Настройте API ключи в разделе "Настройки"',
        },
        { status: 400 },
      )
    }

    // Check daily limit
    const resetTime = new Date(profile.last_export_reset)
    const now = new Date()
    const hoursSinceReset = (now.getTime() - resetTime.getTime()) / (1000 * 60 * 60)

    if (hoursSinceReset >= 24) {
      // Reset the counter
      await supabase
        .from("profiles")
        .update({
          daily_exports_used: 0,
          last_export_reset: now.toISOString(),
        })
        .eq("id", user.id)

      profile.daily_exports_used = 0
    }

    if (profile.daily_exports_used >= profile.daily_exports_limit) {
      return NextResponse.json(
        {
          error: "Достигнут дневной лимит экспортов. Попробуйте завтра.",
        },
        { status: 429 },
      )
    }

    const body = await request.json()
    const { group_name } = body

    if (!group_name) {
      return NextResponse.json({ error: "Укажите название группы" }, { status: 400 })
    }

    // Note: In a production environment, you would use the Python script with Telethon
    // For this demo, we'll simulate the export process

    // This is a placeholder - in production, you'd integrate with Telethon
    return NextResponse.json({
      message: "Функция экспорта требует установки Telethon и настройки Python окружения",
      needsPhone: true,
      info: "В production версии здесь будет интеграция с Telegram API через Telethon",
    })
  } catch (error) {
    console.error("[v0] Export start error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
