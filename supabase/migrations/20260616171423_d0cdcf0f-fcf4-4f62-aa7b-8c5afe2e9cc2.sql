
REVOKE EXECUTE ON FUNCTION public.enforce_buyer_only_signup() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
