-- Включаем расширения для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Таблица пользователей (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  yandex_id TEXT UNIQUE,
  api_id TEXT,
  api_hash TEXT,
  daily_exports_used INTEGER DEFAULT 0,
  daily_exports_limit INTEGER DEFAULT 1,
  last_export_reset TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица истории экспортов
CREATE TABLE IF NOT EXISTS public.export_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  group_name TEXT NOT NULL,
  members_count INTEGER NOT NULL,
  export_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Включаем Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_history ENABLE ROW LEVEL SECURITY;

-- Политики для profiles
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Политики для export_history
CREATE POLICY "export_history_select_own"
  ON public.export_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "export_history_insert_own"
  ON public.export_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_profiles_yandex_id ON public.profiles(yandex_id);
CREATE INDEX IF NOT EXISTS idx_export_history_user_id ON public.export_history(user_id);
CREATE INDEX IF NOT EXISTS idx_export_history_created_at ON public.export_history(created_at DESC);
