# Desafio Backend - Node & Nest

Este é um repositório feito especificadamente para um projeto de teste técnico para uma vaga de emprego. Esta API oferece operações CRUD (Create, Read, Update, Delete) para gerenciar locais, como também uma autenticação básica de usuário.

## Stack utilizada

**Back-end:** Node, NestJS, Prisma

**Banco de Dados:** PostgreSQL

## Rodando localmente

#### Por meio do Docker:

```bash
  # Clone o projeto
  git clone https://github.com/caiorosa-dev/backend-challenge

  # Utilize o Docker Compose
  docker-compose up
```

#### Em ambiente de desenvolvimento:

```bash
  # Clone o projeto
  git clone https://github.com/caiorosa-dev/backend-challenge

  # Entre no diretório do projeto
  cd backend-challenge

  # Instale as dependências
  npm install

  # Configure o .env para a database URL do seu PostgreSQL
  # antes de executar os comandos abaixo.
  # Geração das binaries e migração do Prisma
  npx prisma generate
  npx prisma db push

  # Inicie o servidor
  npm run start:dev
```

## Documentação da API

### Autenticação

#### Registra um novo usuário

```
  POST /users
```

| Body    | Tipo     | Descrição                                          |
| :------ | :------- | :------------------------------------------------- |
| `name`  | `string` | **Obrigatório**. Nome do usuário                   |
| `email` | `string` | **Obrigatório**. Email do usuário                  |
| `senha` | `string` | **Obrigatório (min 3 chars)**. Senha para registro |

#### Realiza Login

```
  POST /auth/signin
```

| Body    | Tipo     | Descrição                            |
| :------ | :------- | :----------------------------------- |
| `email` | `string` | **Obrigatório**. Email do usuário    |
| `senha` | `string` | **Obrigatório**. Senha para registro |

#### Retorna informações do usuário logado

- Rota protegida por autenticação.

```
  GET /users/me
```

### Lugares

- Todas as rotas são protegidas por autenticação.

#### Retorna todos os locais

```
  GET /places
```

| Query  | Tipo      | Descrição                                   |
| :----- | :-------- | :------------------------------------------ |
| `name` | `?string` | **Opcional**. Um nome para efetuar o filtro |

#### Retorna um local

```
  GET /places/${id}
```

| Parâmetro | Tipo     | Descrição                                    |
| :-------- | :------- | :------------------------------------------- |
| `id`      | `string` | **Obrigatório**. O ID do lugar que você quer |

#### Cria um novo local

```
  POST /places
```

| Body    | Tipo     | Descrição                        |
| :------ | :------- | :------------------------------- |
| `name`  | `string` | **Obrigatório**. Nome do local   |
| `city`  | `string` | **Obrigatório**. Cidade do local |
| `state` | `string` | **Obrigatório**. Estado do local |

#### Atualiza um local

```
  PATCH /places/${id}
```

| Parâmetro | Tipo     | Descrição                                     |
| :-------- | :------- | :-------------------------------------------- |
| `id`      | `string` | **Obrigatório**. O ID do lugar a ser deletado |

| Body    | Tipo     | Descrição                                |
| :------ | :------- | :--------------------------------------- |
| `name`  | `string` | **Opcional**. Nome para ser atualizado   |
| `city`  | `string` | **Opcional**. Cidade para ser atualizada |
| `state` | `string` | **Opcional**. Estado para ser atualizado |

#### Deleta um local

```
  DELETE /places/${id}
```

| Parâmetro | Tipo     | Descrição                                     |
| :-------- | :------- | :-------------------------------------------- |
| `id`      | `string` | **Obrigatório**. O ID do lugar a ser deletado |
