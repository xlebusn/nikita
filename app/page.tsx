import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Users, Download, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">TG Export</span>
          </div>
          <Link href="/auth/login">
            <Button variant="ghost">Войти</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Получите список участников <span className="text-primary">закрытой группы</span> Telegram
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Простой и безопасный способ экспортировать участников из ваших Telegram групп
          </p>
          <p className="text-sm text-muted-foreground">* Вы должны состоять в группе для экспорта участников</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Начать бесплатно
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Как это работает
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Полный список</h3>
              <p className="text-sm text-muted-foreground">
                Получите данные всех участников группы: имя, фамилия, username, ID
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Экспорт в CSV</h3>
              <p className="text-sm text-muted-foreground">
                Скачайте результаты в удобном формате CSV для дальнейшей обработки
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Безопасно</h3>
              <p className="text-sm text-muted-foreground">
                Ваши данные защищены. Мы не храним ваши API ключи после использования
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl space-y-12">
          <h2 className="text-balance text-center text-3xl font-bold">Как это работает</h2>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                1
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Зарегистрируйтесь</h3>
                <p className="text-muted-foreground">Создайте аккаунт через email или войдите через Яндекс ID</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                2
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Получите API ключи</h3>
                <p className="text-muted-foreground">
                  Следуйте простой инструкции для получения API ID и API Hash от Telegram
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                3
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Экспортируйте участников</h3>
                <p className="text-muted-foreground">
                  Введите название группы и получите таблицу со всеми участниками. Бесплатно 1 экспорт в сутки!
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-8">
            <Link href="/auth/sign-up">
              <Button size="lg">Попробовать сейчас</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-balance text-center text-3xl font-bold">Тарифы</h2>

          <Card className="border-2 border-primary">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h3 className="text-2xl font-bold">Бесплатный</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold">0</span>
                    <span className="text-muted-foreground">₽</span>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    <span>1 экспорт в сутки</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    <span>Неограниченное количество участников</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    <span>Экспорт в CSV</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    <span>История экспортов</span>
                  </li>
                </ul>

                <Link href="/auth/sign-up" className="block">
                  <Button size="lg" className="w-full">
                    Начать бесплатно
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>2025 TG Export. Экспорт участников Telegram групп.</p>
        </div>
      </footer>
    </div>
  )
}
