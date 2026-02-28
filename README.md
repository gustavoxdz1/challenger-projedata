# challenger-projedata
## Vídeo de demonstração
- Google Drive: https://drive.google.com/file/d/1nkaIo9b8HO-lWpcBV1NPzs53LYAzaaem/view?usp=sharing

# Inventory Production System

Sistema WEB para controlar **produtos**, **matérias-primas (estoque)**, **composição do produto (BOM)** e gerar **sugestões de produção** com base no estoque disponível, priorizando produtos de **maior valor**.


## Resumo rápido (o que o sistema faz)
- CRUD de **Produtos** (criar, listar, editar, deletar)
- CRUD de **Matérias-primas** (criar, listar, editar, deletar)
- **Composição do produto**: vincula matérias-primas e a quantidade necessária para produzir 1 unidade
- **Sugestão de produção (RF004)**: calcula quais produtos podem ser produzidos e o valor total estimado, priorizando os mais caros

## Tecnologias
- **Back-end:** Node.js + Express  
- **Banco:** PostgreSQL  
- **Front-end:** React + Vite + Redux Toolkit  
- **API:** REST (JSON)



## Estrutura do projeto
challenger-projedata/
backend/
frontend/




## Pré-requisitos
- Node.js (recomendado LTS)
- PostgreSQL rodando localmente
- (Opcional) pgAdmin para gerenciar o banco



# 1) Banco de Dados (PostgreSQL)

## Criar o banco
Crie um database chamado `inventory_db` (via pgAdmin ou psql).

## Criar tabelas
Execute o SQL abaixo dentro do `inventory_db`:

```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  value NUMERIC(12,2) NOT NULL CHECK (value >= 0)
);

CREATE TABLE raw_materials (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  stock_quantity NUMERIC(12,3) NOT NULL CHECK (stock_quantity >= 0)
);

CREATE TABLE product_raw_materials (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  raw_material_id BIGINT NOT NULL REFERENCES raw_materials(id) ON DELETE RESTRICT,
  required_quantity NUMERIC(12,3) NOT NULL CHECK (required_quantity > 0),
  CONSTRAINT uq_product_raw UNIQUE (product_id, raw_material_id)
);

## Como rodar o Back-end
cd backend
npm install

Variáveis de ambiente

**Crie backend/.env:

PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_AQUI

**Para subir o servidor do backend 
npm run dev

**Healthcheck

GET http://localhost:3001/api/health
Para verificar se a API esta respondendo a requisicoes etc

**Como rodar o Front-end
Instalar dependências

cd frontend
npm install

**Rodar o front-end
npm run dev
O Vite normalmente sobe em http://localhost:5173

***Endpoints da API (Back-end)
Health

GET /api/health

**Produtos (RF001)

POST /api/products

GET /api/products

GET /api/products/:id

PUT /api/products/:id

DELETE /api/products/:id


**Matérias-primas (RF002)

POST /api/raw-materials

GET /api/raw-materials

GET /api/raw-materials/:id

PUT /api/raw-materials/:id

DELETE /api/raw-materials/:id 


**Composição do produto (RF003 / RF007 no front)

GET /api/products/:productId/materials

POST /api/products/:productId/materials

PUT /api/products/:productId/materials/:rawMaterialId

DELETE /api/products/:productId/materials/:rawMaterialId

**Sugestão de produção (RF004 / RF008 no front)

GET /api/production-suggestions



***Lógica de Sugestão de Produção (RF004)

Ordena produtos por maior valor.

Para cada produto, calcula o máximo produzível pelo gargalo:

min(floor(stock_quantity / required_quantity))

Usa um estoque virtual para “consumir” matéria-prima conforme escolhe produtos, evitando dupla contagem.

Retorna:

lista de produtos sugeridos e quantidades

valor total estimado da produção


**Teste rápido (passo a passo) para a aplicaçao funcionar por completo 

Suba o PostgreSQL e crie o banco/tabelas.

Rode o backend: cd backend && npm run dev

Rode o frontend: cd frontend && npm run dev

Use a interface para:

criar produtos e matérias-primas

associar matérias-primas aos produtos (composição)

ver a sugestão de produção e o total



