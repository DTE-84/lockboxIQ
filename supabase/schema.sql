-- Orbit Supabase Schema
-- This schema integrates seamlessly into the Pulse database (or stands alone)

CREATE TABLE IF NOT EXISTS public.orbit_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- Ties into auth.users
    name TEXT NOT NULL,
    category TEXT,
    cost NUMERIC(10, 2) NOT NULL,
    billing_cycle TEXT,
    status TEXT DEFAULT 'Active',
    payment_method TEXT,
    logo_emoji TEXT,
    cancel_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orbit_vault (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    service TEXT NOT NULL,
    url TEXT,
    username TEXT NOT NULL,
    encrypted_password TEXT NOT NULL, -- Client-side AES-256 encrypted string
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) Policies
ALTER TABLE public.orbit_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orbit_vault ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.orbit_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON public.orbit_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON public.orbit_subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own subscriptions" ON public.orbit_subscriptions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own vault items" ON public.orbit_vault FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vault items" ON public.orbit_vault FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vault items" ON public.orbit_vault FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vault items" ON public.orbit_vault FOR DELETE USING (auth.uid() = user_id);
