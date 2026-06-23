Adicionar `leticiafaian@hotmail.com` à tabela `allowed_buyers` para liberar o acesso desse email no app.

## O que vai acontecer
- Inserir uma linha em `allowed_buyers` com:
  - `email`: leticiafaian@hotmail.com
  - `source`: manual
  - `purchased_at`: agora

## Resultado
Após aprovar, essa pessoa consegue entrar com Google usando esse email e passa pelo gate `_authenticated` sem cair em `/sem-acesso`.