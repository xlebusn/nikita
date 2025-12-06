-- Функция для сброса дневных лимитов экспорта
CREATE OR REPLACE FUNCTION public.reset_daily_export_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    daily_exports_used = 0,
    last_export_reset = NOW()
  WHERE last_export_reset < NOW() - INTERVAL '24 hours';
END;
$$;

-- Можно настроить периодический вызов через pg_cron или вызывать из приложения
