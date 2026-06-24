
CREATE TABLE public.banned_emails (
  id uuid not null default gen_random_uuid() primary key,
  email citext not null unique,
  reason text,
  created_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.banned_emails TO authenticated;
GRANT ALL ON public.banned_emails TO service_role;
ALTER TABLE public.banned_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deny all client access" ON public.banned_emails AS PERMISSIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

-- Ban this specific email
INSERT INTO public.banned_emails (email, reason) VALUES ('lucimereadv@hotmail.com', 'manual ban') ON CONFLICT (email) DO NOTHING;

-- Remove from allowed_buyers so they can't sign in again
DELETE FROM public.allowed_buyers WHERE email = 'lucimereadv@hotmail.com';

-- Delete existing auth user + profile
DELETE FROM auth.users WHERE email = 'lucimereadv@hotmail.com';

-- Block future signups for banned emails
CREATE OR REPLACE FUNCTION public.enforce_buyer_only_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.email IS NULL THEN
    RAISE EXCEPTION 'Email obrigatorio para criar conta';
  END IF;
  IF EXISTS (SELECT 1 FROM public.banned_emails WHERE email = NEW.email) THEN
    RAISE EXCEPTION 'Email banido.' USING ERRCODE = 'check_violation';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.allowed_buyers WHERE email = NEW.email) THEN
    RAISE EXCEPTION 'Email nao autorizado. Compre o acesso primeiro.'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$function$;
