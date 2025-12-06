import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink } from "lucide-react"

export function ApiSettingsGuide() {
  return (
    <Alert>
      <AlertDescription>
        <div className="space-y-3">
          <strong className="text-base">Как получить API ключи Telegram:</strong>
          <ol className="mt-2 list-inside list-decimal space-y-2 text-sm">
            <li>
              Перейдите на{" "}
              <a
                href="https://my.telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                my.telegram.org
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>Войдите с помощью вашего номера телефона Telegram</li>
            <li>
              Перейдите в раздел{" "}
              <a
                href="https://my.telegram.org/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                "API development tools"
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              Заполните форму создания приложения:
              <ul className="ml-6 mt-1 list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>App title:</strong> TG Export (любое название)
                </li>
                <li>
                  <strong>Short name:</strong> tgexport
                </li>
                <li>
                  <strong>Platform:</strong> Other
                </li>
              </ul>
            </li>
            <li>
              После создания скопируйте:
              <ul className="ml-6 mt-1 list-disc space-y-1">
                <li>
                  <strong>api_id</strong> (число, например: 12345678)
                </li>
                <li>
                  <strong>api_hash</strong> (строка из 32 символов)
                </li>
              </ul>
            </li>
            <li>Вставьте полученные значения в поля ниже</li>
          </ol>
          <div className="mt-3 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
            <strong>Важно:</strong> Эти ключи безопасно хранятся в базе данных и используются только для подключения к
            вашему Telegram аккаунту. Никто кроме вас не имеет к ним доступа.
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
