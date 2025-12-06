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

    const body = await request.json()
    const { code, group_name } = body

    // This is a demo/placeholder implementation
    // In production, this would verify the code with Telethon and get actual members

    const mockMembers = [
      { first_name: "Иван", last_name: "Иванов", username: "ivanov", user_id: 123456 },
      { first_name: "Петр", last_name: "Петров", username: "petrov", user_id: 234567 },
      { first_name: "Мария", last_name: "Сидорова", username: "sidorova", user_id: 345678 },
    ]

    // Save to export history
    const { error: insertError } = await supabase.from("export_history").insert({
      user_id: user.id,
      group_name,
      members_count: mockMembers.length,
      export_data: { members: mockMembers },
    })

    if (insertError) {
      console.error("[v0] Error saving export history:", insertError)
    }

    // Increment export counter
    await supabase
      .rpc("increment", {
        row_id: user.id,
        x: 1,
      })
      .catch(() => {
        // Fallback if RPC doesn't exist
        supabase
          .from("profiles")
          .update({ daily_exports_used: supabase.raw("daily_exports_used + 1") })
          .eq("id", user.id)
      })

    return NextResponse.json({
      success: true,
      members: mockMembers,
      group_name,
    })
  } catch (error) {
    console.error("[v0] Verify code error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
