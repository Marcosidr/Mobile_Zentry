# Mobile_Zentry

Monorepo do projeto **StockFlow**, um app mobile para controle de estoque de pequenos negocios. A estrutura foi montada para atender a rubrica de Desenvolvimento Mobile, Engenharia/Analise de Projeto e Tech Forge.

## Estrutura

```text
.
├── api/
│   ├── prisma/
│   ├── src/
│   └── uploads/
├── mobile/
│   └── src/
├── docs/
│   └── diagramas/
├── docker-compose.yml
└── package.json
```

## Stack

- Mobile: Expo, React Native, TypeScript, Axios e React Navigation
- API: Node.js, Express, TypeScript, JWT, bcrypt, Multer e Zod
- Banco: PostgreSQL com Prisma ORM
- Upload: imagens JPG, JPEG, PNG e WEBP com limite de 5 MB e nome unico

## Como rodar

1. Crie os arquivos de ambiente:

```bash
cp api/.env.example api/.env
cp mobile/.env.example mobile/.env
```

2. Suba o PostgreSQL:

```bash
docker compose up -d
```

3. Gere o Prisma Client e rode a migracao:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

4. Inicie a API:

```bash
npm run dev:api
```

5. Em outro terminal, inicie o app:

```bash
npm run dev:mobile
```

Credenciais de demonstracao apos o seed:

- Admin: `admin@stockflow.com` / `admin123`
- Usuario: `user@stockflow.com` / `user123`

> O PostgreSQL do Docker usa a porta local `5433` para evitar conflito com instalacoes locais do PostgreSQL. Em emulador Android, use `EXPO_PUBLIC_API_URL=http://10.0.2.2:3333/api` no arquivo `mobile/.env`.

## Endpoints principais

- `POST /api/auth/login`
- `POST /api/auth/register` (somente primeiro usuario em banco vazio)
- `GET /api/users` (ADMIN)`r`n- `POST /api/users` (ADMIN)`r`n- `PUT /api/users/:id` (ADMIN)`r`n- `DELETE /api/users/:id` (ADMIN)`r`n- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/products/:id/image`
- `POST /api/stock-movements`
- `GET /api/stock-movements`

## Rubrica

- Arquitetura: pastas separadas por contexto no app e por modulo na API
- CRUD completo: Produto, Categoria, Usuario e Movimentacao passam por App, API e Banco
- Regras de negocio: saida nao pode deixar estoque negativo, estoque baixo e permissao por perfil
- Tech Forge: Multer com validacao de MIME, extensao, tamanho e colisao
- Documentacao: requisitos, persona, evolucao e diagramas em `docs/`

