## Como vai funcionar

1. O comprador finaliza a compra na Kiwify/Hotmart/Cakto.
2. A plataforma chama um **webhook** do seu app e o email entra numa lista de "compradores liberados".
3. O comprador abre o app, digita o email em `/auth` e recebe um **link mágico** no email dele.
4. Ele clica no link → entra direto no app, sem senha. Acesso vitalício.
5. Se um email **não está na lista de compradores**, o link mágico nem é enviado — aparece "Email não encontrado. Compre o acesso primeiro."

## O que vou construir

### 1. Backend (Lovable Cloud)

Ativar Lovable Cloud e criar:

- Tabela `allowed_buyers` (`email` único, `source` = kiwify/hotmart/cakto/manual, `purchased_at`, `external_order_id`).
- Tabela `profiles` mínima (`id` → `auth.users`, `email`, `created_at`) criada por trigger ao confirmar o login.
- Trigger `before insert on auth.users` que **bloqueia** a criação do usuário se o email não estiver em `allowed_buyers` (retorna erro → magic link não autentica intruso).
- RLS: `allowed_buyers` só leitura pelo `service_role`; `profiles` o usuário lê/edita só o próprio.

### 2. Webhooks de compra (rotas públicas seguras)

Três endpoints em `src/routes/api/public/webhooks/`:

- `/api/public/webhooks/kiwify` (POST)
- `/api/public/webhooks/hotmart` (POST)
- `/api/public/webhooks/cakto` (POST)

Cada um:
- Verifica a **assinatura HMAC** do header com o segredo da plataforma (timing-safe compare).
- Aceita só eventos de compra aprovada (`order.paid`, `PURCHASE_APPROVED`, etc.).
- Faz `upsert` do email em `allowed_buyers`.
- Reembolso/chargeback → remove o email (configurável; padrão acesso vitalício mantém).

Segredos necessários (vou pedir depois de ativar o Cloud):
`KIWIFY_WEBHOOK_SECRET`, `HOTMART_WEBHOOK_SECRET`, `CAKTO_WEBHOOK_SECRET`.

### 3. Tela de login `/auth`

Página pública nova com:
- Campo de email + botão "Receber link de acesso".
- Chama `supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: window.location.origin } })`.
- Mensagens claras: "Link enviado, confira seu email" / "Email não encontrado, compre o acesso em [link de vendas]".
- Reenvio com cooldown de 60s para evitar spam.

### 4. Proteção das rotas do app

Mover as rotas internas (`/library`, `/book/$id`, `/read/$id`, `/favorites`, `/profile`, `/categories`, `/category/$slug`, `/collection/$slug`) para baixo de `src/routes/_authenticated/` — o layout gerenciado redireciona para `/auth` se não tiver sessão.

Rotas públicas continuam abertas: `/`, `/vendas`, `/upsell`, `/downsell`, `/obrigado`, `/auth`.

### 5. Painel admin opcional (futuro)

Não entra agora, mas a tabela já suporta: depois dá pra liberar/revogar email manualmente via SQL ou uma página `/admin`.

## Detalhes técnicos

- **Provedor de auth**: Supabase via Lovable Cloud, método `signInWithOtp` (magic link). Sem senha, sem Google.
- **Bloqueio de não-compradores**: o `shouldCreateUser: false` impede criar conta nova; o trigger `auth.users` é o segundo cinto de segurança caso o flag seja contornado.
- **Webhooks**: `createFileRoute` em `/api/public/*` (sem auth de plataforma), assinatura verificada em cada handler, `supabaseAdmin` carregado dentro do handler.
- **Email transacional**: o próprio Supabase Auth manda o magic link (template customizável no painel do Cloud). Sem precisar de Resend agora.
- **Sessão**: persistida no `localStorage` pelo cliente Supabase já existente; layout `_authenticated` (`ssr: false`) faz a guarda no client.

## Próximos passos depois do plano aprovado

1. Eu ativo o Lovable Cloud e crio a migration de tabelas + trigger.
2. Crio rotas de webhook e a página `/auth`.
3. Movo as páginas internas para `_authenticated/`.
4. Te peço os 3 segredos de webhook e te passo as 3 URLs pra colar na Kiwify/Hotmart/Cakto.
