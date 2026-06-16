
CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO anon, authenticated, service_role;
ALTER EXTENSION citext SET SCHEMA extensions;

CREATE POLICY "Deny all client access" ON public.allowed_buyers
  FOR ALL TO anon, authenticated
  USING (false) WITH CHECK (false);
