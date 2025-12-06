import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("api_id, api_hash, daily_exports_used, daily_limit")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("[v0] Error fetching settings:", profileError)
      return NextResponse.json({ error: "Ошибка загрузки настроек" }, { status: 500 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("[v0] Settings GET error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

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

    const body = await request.json()
    const { api_id, api_hash } = body

    if (!api_id || !api_hash) {
      return NextResponse.json({ error: "Заполните все поля" }, { status: 400 })
    }

    console.log("[v0] Saving settings for user:", user.id)

    // Update profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        api_id: api_id.trim(),
        api_hash: api_hash.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("[v0] Error updating settings:", updateError)
      return NextResponse.json({ error: "Ошибка сохранения настроек" }, { status: 500 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("api_id, api_hash, daily_exports_used, daily_limit")
      .eq("id", user.id)
      .single()

    console.log("[v0] Settings saved successfully")
    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error("[v0] Settings API error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
