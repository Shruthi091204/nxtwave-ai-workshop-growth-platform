-- NxtWave Campaign Platform - Supabase Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    whatsapp TEXT NOT NULL,
    college TEXT NOT NULL,
    branch TEXT NOT NULL,
    grad_year TEXT NOT NULL,
    source TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    referral_code TEXT UNIQUE NOT NULL,
    referred_by TEXT, -- Stores the referral_code of the person who referred them
    attended BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EVENTS TABLE (Analytics tracking)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT NOT NULL, -- page_view, form_start, form_submit, share_click, ai_tool_used
    meta JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SUBMISSIONS TABLE (For Phase F - Project Evaluator)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL REFERENCES public.registrations(email),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false,
    score_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SET ROW LEVEL SECURITY (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- Registrations: Anyone can insert, but only authenticated admin can read
CREATE POLICY "Enable insert for anonymous users" ON public.registrations
    FOR INSERT WITH CHECK (true);

-- Allow reading own registration by email (useful if we want to check if email exists from server)
-- Note: In a real secure app, we would use a service role key on the server to bypass RLS for reading.
-- We will use the Service Role key in our Next.js Server Actions, so RLS for reading isn't strictly needed for the public.

-- Events: Anyone can insert
CREATE POLICY "Enable insert for anonymous users on events" ON public.events
    FOR INSERT WITH CHECK (true);

-- Submissions: Anyone can insert
CREATE POLICY "Enable insert for anonymous users on submissions" ON public.submissions
    FOR INSERT WITH CHECK (true);

-- PHASE E: LIVE WORKSHOP TABLES
CREATE TABLE IF NOT EXISTS public.live_state (
    id INT PRIMARY KEY DEFAULT 1,
    current_step TEXT DEFAULT 'Waiting', -- Waiting, Setup, Build, Deploy, Showcase
    countdown_end TIMESTAMP WITH TIME ZONE,
    active_poll_id UUID,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.polls (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- e.g. ["Yes", "No"]
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.poll_votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    poll_id UUID REFERENCES public.polls(id),
    email TEXT NOT NULL, -- references registration
    option_index INT NOT NULL,
    UNIQUE(poll_id, email)
);

CREATE TABLE IF NOT EXISTS public.help_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    note TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, solved
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for Phase E (simple permissive for workshop speed, lock down in real prod)
ALTER TABLE public.live_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for anonymous users" ON public.live_state FOR SELECT USING (true);
CREATE POLICY "Enable update for service role" ON public.live_state FOR UPDATE USING (true);
CREATE POLICY "Enable insert for service role" ON public.live_state FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for anonymous users" ON public.polls FOR SELECT USING (true);
CREATE POLICY "Enable insert/update for service role" ON public.polls FOR ALL USING (true);

CREATE POLICY "Enable insert/read for anonymous users" ON public.poll_votes FOR ALL USING (true);
CREATE POLICY "Enable insert/read/update for anonymous users" ON public.help_requests FOR ALL USING (true);

