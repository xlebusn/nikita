"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogOut, Users, Download, History, AlertCircle, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ApiSettingsGuide } from "@/components/api-settings-guide"
import { useToast } from "@/components/ui/use-toast"

interface Profile {
  id: string
  email: string
  display_name: string | null
  api_id: string | null
  api_hash: string | null
  daily_exports_used: number
  daily_exports_limit: number
  last_export_reset: string
}

interface ExportHistoryItem {
  id: string
  group_name: string
  members_count: number
  export_data: any
  created_at: string
}

interface DashboardClientProps {
  profile: Profile | null
  exportHistory: ExportHistoryItem[]
}

export function DashboardClient({
  profile: initialProfile,
  exportHistory: initialExportHistory,
}: DashboardClientProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [profile, setProfile] = useState(initialProfile)
  const [activeTab, setActiveTab] = useState("export")

  // Settings state
  const [apiId, setApiId] = useState(profile?.api_id || "")
  const [apiHash, setApiHash] = useState(profile?.api_hash || "")
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Export state
  const [groupName, setGroupName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [exportStep, setExportStep] = useState<"input" | "phone" | "code" | "result">("input")
  const [exportResult, setExportResult] = useState<any>(null)
  const [exportError, setExportError] = useState<string | null>(null)

  const hasApiCredentials = (profile?.api_id && profile?.api_hash) || (apiId && apiHash)
  const dailyLimit = profile?.daily_exports_limit || 1
  const dailyUsed = profile?.daily_exports_used || 0
  const canExport = dailyUsed < dailyLimit

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleSaveSettings = async () => {
    if (!apiId || !apiHash) {
      setSettingsMessage({ type: "error", text: "Пожалуйста, заполните все поля" })
      return
    }

    setIsSavingSettings(true)
    setSettingsMessage(null)

    try {
      console.log("[v0] Sending settings to API...")
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_id: apiId, api_hash: apiHash }),
      })

      const data = await response.json()
      console.log("[v0] Settings API response:", data)

      if (!response.ok) throw new Error(data.error || "Ошибка сохранения")

      if (data.profile) {
        setProfile(data.profile)
        console.log("[v0] Profile state updated")
      }

      setSettingsMessage({ type: "success", text: "Настройки сохранены успешно!" })

      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
      setSettingsMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Ошибка сохранения",
      })
    } finally {
      setIsSavingSettings(false)
    }
  }

  const handleStartExport = async () => {
    if (!groupName.trim()) {
      setExportError("Введите название группы")
      return
    }

    setIsExporting(true)
    setExportError(null)

    try {
      const response = await fetch("/api/export/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ group_name: groupName }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Ошибка экспорта")

      if (data.needsPhone) {
        setExportStep("phone")
      } else if (data.needsCode) {
        setExportStep("code")
      } else if (data.members) {
        setExportResult(data)
        setExportStep("result")
      }
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "Ошибка экспорта")
    } finally {
      setIsExporting(false)
    }
  }

  const handleSendPhone = async () => {
    setIsExporting(true)
    setExportError(null)

    try {
      const response = await fetch("/api/export/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phoneNumber }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Ошибка отправки телефона")

      setExportStep("code")
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "Ошибка отправки телефона")
    } finally {
      setIsExporting(false)
    }
  }

  const handleSendCode = async () => {
    setIsExporting(true)
    setExportError(null)

    try {
      const response = await fetch("/api/export/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode, group_name: groupName }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Ошибка верификации")

      setExportResult(data)
      setExportStep("result")
      router.refresh()
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "Ошибка верификации")
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadCSV = () => {
    if (!exportResult?.members) return

    const csv = [
      ["Имя", "Фамилия", "Username", "User ID"],
      ...exportResult.members.map((m: any) => [m.first_name || "", m.last_name || "", m.username || "", m.user_id]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${exportResult.group_name}_members.csv`
    link.click()
  }

  const handleDownloadHistoryCSV = (item: ExportHistoryItem) => {
    const members = item.export_data.members || []
    const csv = [
      ["Имя", "Фамилия", "Username", "User ID"],
      ...members.map((m: any) => [m.first_name || "", m.last_name || "", m.username || "", m.user_id]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${item.group_name}_members.csv`
    link.click()
  }

  const resetExport = () => {
    setExportStep("input")
    setGroupName("")
    setPhoneNumber("")
    setVerificationCode("")
    setExportResult(null)
    setExportError(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">TG Export</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{profile?.display_name || profile?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Личный кабинет</h1>
          <p className="text-muted-foreground">
            Доступно экспортов сегодня: {dailyLimit - dailyUsed} из {dailyLimit}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export">Экспорт</TabsTrigger>
            <TabsTrigger value="history">История</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          {/* Export Tab */}
          <TabsContent value="export" className="mt-6">
            {!hasApiCredentials ? (
              <Card>
                <CardHeader>
                  <CardTitle>Настройте API</CardTitle>
                  <CardDescription>Сначала добавьте Telegram API ключи во вкладке Настройки</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveTab("settings")} className="w-full">
                    Перейти к настройкам
                  </Button>
                </CardContent>
              </Card>
            ) : !canExport ? (
              <Card>
                <CardHeader>
                  <CardTitle>Лимит исчерпан</CardTitle>
                  <CardDescription>
                    Вы использовали все бесплатные экспорты на сегодня. Лимит обновится завтра.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Экспорт участников группы</CardTitle>
                  <CardDescription>Осталось экспортов сегодня: {dailyLimit - dailyUsed}</CardDescription>
                </CardHeader>
                <CardContent>
                  {!canExport && (
                    <Alert className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Вы достигли дневного лимита экспортов</AlertDescription>
                    </Alert>
                  )}

                  {exportStep === "input" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="groupName">Название группы</Label>
                        <Input
                          id="groupName"
                          placeholder="Например: My Private Group"
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                          disabled={!canExport}
                        />
                        <p className="text-xs text-muted-foreground">Введите точное название группы или её username</p>
                      </div>
                      {exportError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{exportError}</AlertDescription>
                        </Alert>
                      )}
                      <Button onClick={handleStartExport} disabled={!canExport || isExporting} className="w-full">
                        {isExporting ? "Подключение..." : "Начать экспорт"}
                      </Button>
                    </div>
                  )}

                  {exportStep === "phone" && (
                    <div className="space-y-4">
                      <Alert>
                        <AlertDescription>
                          Требуется авторизация в Telegram. Введите ваш номер телефона.
                        </AlertDescription>
                      </Alert>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Номер телефона</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+79991234567"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                      {exportError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{exportError}</AlertDescription>
                        </Alert>
                      )}
                      <div className="flex gap-2">
                        <Button onClick={resetExport} variant="outline" className="flex-1 bg-transparent">
                          Отмена
                        </Button>
                        <Button onClick={handleSendPhone} disabled={isExporting} className="flex-1">
                          {isExporting ? "Отправка..." : "Отправить"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {exportStep === "code" && (
                    <div className="space-y-4">
                      <Alert>
                        <AlertDescription>Код подтверждения отправлен в Telegram. Введите его ниже.</AlertDescription>
                      </Alert>
                      <div className="space-y-2">
                        <Label htmlFor="code">Код подтверждения</Label>
                        <Input
                          id="code"
                          placeholder="12345"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                        />
                      </div>
                      {exportError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{exportError}</AlertDescription>
                        </Alert>
                      )}
                      <div className="flex gap-2">
                        <Button onClick={resetExport} variant="outline" className="flex-1 bg-transparent">
                          Отмена
                        </Button>
                        <Button onClick={handleSendCode} disabled={isExporting} className="flex-1">
                          {isExporting ? "Проверка..." : "Подтвердить"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {exportStep === "result" && exportResult && (
                    <div className="space-y-4">
                      <Alert>
                        <AlertDescription>
                          Экспорт завершен! Найдено участников: {exportResult.members.length}
                        </AlertDescription>
                      </Alert>

                      <div className="rounded-lg border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Имя</TableHead>
                              <TableHead>Фамилия</TableHead>
                              <TableHead>Username</TableHead>
                              <TableHead>ID</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {exportResult.members.slice(0, 10).map((member: any, idx: number) => (
                              <TableRow key={idx}>
                                <TableCell>{member.first_name || "-"}</TableCell>
                                <TableCell>{member.last_name || "-"}</TableCell>
                                <TableCell>
                                  {member.username ? (
                                    <a
                                      href={`https://t.me/${member.username}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-primary hover:underline"
                                    >
                                      @{member.username}
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  ) : (
                                    "-"
                                  )}
                                </TableCell>
                                <TableCell className="font-mono text-xs">{member.user_id}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        {exportResult.members.length > 10 && (
                          <div className="border-t p-4 text-center text-sm text-muted-foreground">
                            Показано 10 из {exportResult.members.length} участников
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={resetExport} variant="outline" className="flex-1 bg-transparent">
                          Новый экспорт
                        </Button>
                        <Button onClick={handleDownloadCSV} className="flex-1">
                          <Download className="mr-2 h-4 w-4" />
                          Скачать CSV
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>История экспортов</CardTitle>
                <CardDescription>Последние 10 экспортов</CardDescription>
              </CardHeader>
              <CardContent>
                {initialExportHistory.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <History className="mx-auto mb-4 h-12 w-12 opacity-20" />
                    <p>Экспортов пока нет</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {initialExportHistory.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                          <p className="font-medium">{item.group_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.members_count} участников • {new Date(item.created_at).toLocaleString("ru-RU")}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleDownloadHistoryCSV(item)}>
                          <Download className="mr-2 h-4 w-4" />
                          CSV
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Настройки API</CardTitle>
                <CardDescription>Настройте Telegram API для экспорта участников</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ApiSettingsGuide />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiId">API ID</Label>
                    <Input id="apiId" placeholder="12345678" value={apiId} onChange={(e) => setApiId(e.target.value)} />
                    <p className="text-xs text-muted-foreground">Числовой идентификатор из my.telegram.org</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apiHash">API Hash</Label>
                    <Input
                      id="apiHash"
                      type="password"
                      placeholder="0123456789abcdef0123456789abcdef"
                      value={apiHash}
                      onChange={(e) => setApiHash(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Строка из 32 символов из my.telegram.org</p>
                  </div>

                  {settingsMessage && (
                    <Alert variant={settingsMessage.type === "error" ? "destructive" : "default"}>
                      <AlertDescription>{settingsMessage.text}</AlertDescription>
                    </Alert>
                  )}

                  <Button onClick={handleSaveSettings} disabled={isSavingSettings} className="w-full">
                    {isSavingSettings ? "Сохранение..." : "Сохранить настройки"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
