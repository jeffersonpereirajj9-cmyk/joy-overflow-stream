## Escopo

Transformar o Bookfy em um app premium cobrindo 13 áreas (UI, UX, Performance, Leitura, Biblioteca, Conversão, Copy, Microinterações, Retenção, Acessibilidade, Responsividade, Estabilidade, Acabamento).

O projeto já tem boa parte da base feita nas rodadas anteriores (mesh gradient, glass nav, Fraunces serif, busca global, preload on intent, lazy mount, Sentry, Toaster, pixel deferido). Este plano foca no que **ainda falta** para chegar ao nível "app de grande empresa".

## O que vou implementar

### 1. Leitor EPUB premium (`/read/$id`)
- Substituir o "sample chapter" estático por leitor EPUB real usando `epubjs` (renderiza o arquivo baixado/streamed).
- Continuar lendo: salvar última posição (CFI) por livro em localStorage.
- Barra de progresso fixa no topo + navegação por capítulos (TOC drawer).
- Controles refinados: tamanho fonte (A-/A+), espaçamento, tema claro/sépia/escuro, bookmark, swipe horizontal entre páginas.

### 2. Home com "Continue lendo" + "Recém adicionados" + "Para você"
- Nova seção topo: cards horizontais dos livros em progresso (lidos do localStorage `bookfy:reader:*`).
- Seção "Recém adicionados" baseada em ordem do catálogo.
- Seção "Recomendados" baseada em categorias favoritadas do usuário.

### 3. Conquistas e metas (retenção)
- Componente `ReadingStats` no perfil: livros baixados, livros começados, streak de dias.
- Meta semanal simples (3 livros/semana) com barra de progresso.
- Tudo client-side (localStorage), sem backend.

### 4. Biblioteca inteligente
- Adicionar filtros rápidos na `/library` e `/search`: gênero, autora, "mais populares" (chip toggles).
- Empty states ilustrados quando filtro não retorna nada.

### 5. Microinterações
- Adicionar utilitários CSS: `fade-in`, `scroll-reveal`, `ripple`, `floating-card`.
- Aplicar `scroll-reveal` (IntersectionObserver) nos `HorizontalScroller` da home.
- Ripple sutil nos botões primários.

### 6. Acessibilidade
- Auditar e adicionar `aria-label` em todos botões icon-only.
- Garantir contraste AA em `text-muted-foreground` sobre mesh-bg.
- Tap targets mínimos 44px nos itens da `BottomNav` e botões de download.
- Foco visível (`focus-visible:ring-2 ring-primary/60`) global.

### 7. Performance final
- Code-split rotas pesadas (`/vendas`, `/upsell`, `/downsell`, `/quiz`) via dynamic import — já roteado mas garantir tree-shaking.
- Adicionar `loading="lazy"` + `decoding="async"` em qualquer `<img>` que ainda não tenha.
- Comprimir/otimizar capas via `srcset` quando vier do Google Books (já tem fallback, faltam tamanhos).

### 8. Acabamento visual
- Padronizar paddings de páginas (`px-5 pt-6 pb-8`).
- Hierarquia de títulos: H1 serif 28-32px, H2 serif 20-22px, corpo Inter 14-15px.
- Revisar `PageHeader`, `BookCard`, `CategoryChip` para consistência de raio (`rounded-2xl`) e shadows (`soft-shadow`).

### 9. QA final
- Rodar typecheck, abrir Playwright nas rotas críticas (`/`, `/search`, `/library`, `/book/$id`, `/read/$id`, `/auth`, `/vendas`) em viewport mobile (390x844) e capturar screenshots.
- Corrigir qualquer overflow horizontal, contraste baixo ou tap target pequeno encontrado.

## O que NÃO vou fazer nesta rodada

- Trocar backend de auth/pagamento (já está estável).
- Adicionar PWA/offline real (mudança grande — peço confirmação separada).
- Reescrever copy das landing pages `/vendas` `/upsell` `/downsell` (já aprovadas pelo usuário).
- Mexer em webhooks ou schema do banco.

## Estimativa

~15-20 arquivos tocados, principalmente: `read.$id.tsx`, `index.tsx`, `library.tsx`, `search.tsx`, `profile.tsx`, `BottomNav`, `HorizontalScroller`, `BookCard`, `styles.css`, 2-3 novos componentes (`ContinueReading`, `ReadingStats`, `ScrollReveal`), 1 dependência nova (`epubjs`).

Posso seguir?
