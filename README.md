# mock-data-generator

Gerador de dados fictícios (mock data) para testes. Interface web em React.

⚠️ Os documentos gerados são **válidos** (dígitos verificadores corretos), mas
**fictícios** — não correspondem a pessoas ou empresas reais. Use apenas para
testes e desenvolvimento.

## Geradores disponíveis

- **CPF** — com dígitos verificadores válidos
- **CNPJ** — com dígitos verificadores válidos

Cada gerador permite copiar o valor com máscara (`123.456.789-09`) ou só números.

## Stack

- [Vite](https://vite.dev/) + React + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) usando **Base UI** (não Radix) — preset `base-nova`

## Como rodar localmente

```bash
npm install      # instala as dependências (primeira vez)
npm run dev      # inicia em http://localhost:5173
```

Outros comandos:

```bash
npm run build    # build de produção (type-check + bundle) em dist/
npm run preview  # serve o build de produção localmente
```

## Estrutura

```
src/
├── App.tsx                      # tela principal (tabs CPF / CNPJ)
├── components/
│   ├── generator-panel.tsx      # painel reutilizável (gerar / copiar / formato)
│   └── ui/                      # componentes shadcn (Base UI)
└── lib/
    └── generators/
        ├── cpf.ts               # geração e validação de CPF
        └── cnpj.ts              # geração e validação de CNPJ
```

## Adicionando novos geradores

1. Crie `src/lib/generators/<tipo>.ts` exportando `generate<Tipo>(formatted = true)`.
2. Adicione uma aba em `src/App.tsx` reusando `<GeneratorPanel />`.
