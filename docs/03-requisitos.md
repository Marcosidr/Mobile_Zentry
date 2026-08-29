# Requisitos

## Requisitos Funcionais

| Codigo | Requisito | Perfil |
| --- | --- | --- |
| RF01 | Autenticar usuario com e-mail e senha | ADMIN, USER |
| RF02 | Cadastrar produtos | ADMIN |
| RF03 | Consultar produtos | ADMIN, USER |
| RF04 | Editar produtos | ADMIN |
| RF05 | Excluir produtos | ADMIN |
| RF06 | Enviar imagem de produto | ADMIN |
| RF07 | Cadastrar categorias | ADMIN |
| RF08 | Registrar entrada de estoque | ADMIN, USER |
| RF09 | Registrar saida de estoque | ADMIN, USER |
| RF10 | Listar ultimas movimentacoes | ADMIN, USER |
| RF11 | Gerenciar perfil de usuarios | ADMIN |

## Requisitos Nao Funcionais

| Codigo | Requisito |
| --- | --- |
| RNF01 | Backend desenvolvido em TypeScript |
| RNF02 | Frontend mobile desenvolvido em React Native |
| RNF03 | API REST usando JSON |
| RNF04 | Banco PostgreSQL acessado via Prisma ORM |
| RNF05 | Autenticacao com JWT |
| RNF06 | Senhas armazenadas com hash bcrypt |
| RNF07 | Upload limitado a 5 MB por imagem |
| RNF08 | Suporte apenas a JPG, JPEG, PNG e WEBP |
| RNF09 | Separacao de responsabilidades por controllers, services e schemas |
| RNF10 | Projeto versionado em GitHub |

