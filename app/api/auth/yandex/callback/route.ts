import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error || !code) {
    return NextResponse.redirect(new URL("/auth/login?error=yandex_auth_failed", request.url))
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch("https://oauth.yandex.ru/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.YANDEX_CLIENT_ID!,
        client_secret: process.env.YANDEX_CLIENT_SECRET!,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token")
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Get user info from Yandex
    const userInfoResponse = await fetch("https://login.yandex.ru/info", {
      headers: {
        Authorization: `OAuth ${accessToken}`,
      },
    })

    if (!userInfoResponse.ok) {
      throw new Error("Failed to get user info")
    }

    const userInfo = await userInfoResponse.json()

    const supabase = await createClient()

    // Check if user exists
    const { data: existingProfile } = await supabase.from("profiles").select("*").eq("yandex_id", userInfo.id).single()

    if (existingProfile) {
      // User exists, sign them in via Supabase
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user && user.id === existingProfile.id) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    // Create new user with email/password (use Yandex ID as temporary password)
    const email = userInfo.default_email || `${userInfo.id}@yandex-oauth.temp`
    const tempPassword = `yandex_${userInfo.id}_${Math.random().toString(36).slice(2)}`

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: tempPassword,
      options: {
        data: {
          display_name: userInfo.display_name || userInfo.login,
          yandex_id: userInfo.id,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
      },
    })

    if (signUpError) {
      // Try to sign in instead
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: tempPassword,
      })

      if (signInError) throw signInError
    }

    // Update profile with Yandex ID
    if (authData.user) {
      await supabase.from("profiles").update({ yandex_id: userInfo.id }).eq("id", authData.user.id)
    }

    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("[v0] Yandex OAuth error:", error)
    return NextResponse.redirect(new URL("/auth/login?error=yandex_callback_failed", request.url))
  }
}
