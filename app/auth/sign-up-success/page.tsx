import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, Users } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center gap-2">
        <Users className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold">TG Export</span>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Проверьте вашу почту</CardTitle>
          <CardDescription>
            Мы отправили письмо с подтверждением на вашу почту. Пожалуйста, перейдите по ссылке в письме для активации
            аккаунта.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/auth/login">
            <Button className="w-full">Вернуться к входу</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
