import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard-client"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  console.log("[v0] Loading dashboard for user:", user.id)

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  let userProfile = profile

  if (!userProfile && !profileError) {
    console.log("[v0] Profile not found, creating new profile")
    const { data: newProfile, error: createError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email || "",
        display_name: user.user_metadata?.display_name || user.email?.split("@")[0] || "User",
      })
      .select()
      .single()

    if (createError) {
      console.error("[v0] Error creating profile:", createError)
    } else {
      console.log("[v0] Profile created successfully")
      userProfile = newProfile
    }
  }

  if (profileError) {
    console.error("[v0] Error loading profile:", profileError)
  } else {
    console.log("[v0] Profile loaded:", {
      hasApiId: !!userProfile?.api_id,
      hasApiHash: !!userProfile?.api_hash,
    })
  }

  // Get export history
  const { data: exportHistory } = await supabase
    .from("export_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  return <DashboardClient profile={userProfile} exportHistory={exportHistory || []} />
}
