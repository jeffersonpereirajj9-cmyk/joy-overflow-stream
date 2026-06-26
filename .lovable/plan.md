# Remover livros "prévia" por tamanho de arquivo

## Objetivo
Identificar e remover do catálogo (`src/data/drive-catalog.json`) todos os arquivos cujo tamanho real no Google Drive seja menor que um limite (X KB) — esses costumam ser amostras/degustações, não livros completos.

## Etapas

### 1. Definir o limite X
Sugestão: **300 KB** como corte inicial.
- EPUBs completos quase sempre passam de 400–500 KB.
- Amostras/prévias geralmente ficam entre 30–250 KB.
- Posso ajustar (200, 400, 500 KB) — me diga se prefere outro valor.

### 2. Buscar tamanhos no Google Drive
Rodar um script local que, para cada um dos ~12.308 arquivos do catálogo:
- chama a API do Drive (`files/{id}?fields=size,name,mimeType`) via conector já conectado
- grava `{id, name, size}` em `/tmp/drive-sizes.json`
- usa concorrência (~20 requisições paralelas) e retry em 429/5xx

Tempo estimado: **15–25 min** de execução de script (não bloqueia você, só consome turnos meus).

### 3. Gerar relatório antes de apagar
Produzir `/tmp/previews-report.txt` listando:
- total de arquivos abaixo de X KB
- amostra dos 50 primeiros (título, autor, tamanho)

Você confirma antes de eu apagar de fato.

### 4. Aplicar remoção
Filtrar `src/data/drive-catalog.json` removendo os IDs abaixo do limite e salvar o novo arquivo. Reportar quantos sobraram.

### 5. (Opcional) Cache de tamanhos
Salvar `src/data/drive-sizes.json` para reuso futuro (mostrar tamanho na UI sem HEAD requests).

## O que preciso de você antes de começar
1. Confirmar o limite **X em KB** (sugiro 300).
2. Confirmar se quer o passo 5 (cache de tamanhos no repo).
