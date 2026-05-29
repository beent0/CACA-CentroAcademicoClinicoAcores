# CACA - Centro Académico Clínico dos Açores

Este projeto foi desenvolvido no âmbito da unidade curricular de **Tecnologias Web (2025/2026)**. Consiste numa plataforma digital para o Centro Académico Clínico dos Açores, integrando gestão de eventos, notícias em tempo real, meteorologia e um sistema completo de gestão de utilizadores.

---------------------------------------------------------------------------------------------------------------------

## Grupo (Época Especial / PE)
*   **João Bento** - 2023110753
*   **Manuel Santos** - 2023110848
*   **Yuri Moreira** - 2023118908
    **Newton Pereira** - 2022112784

----------------------------------------------------------------------------------------------------------------------

## Tecnologias Utilizadas

### Frontend
*   **React 19 (TypeScript/JSX)**: Framework para construção da interface.
*   **React Router Dom**: Gestão de rotas e navegação.
*   **Axios**: Cliente HTTP para comunicação com a API.
*   **D3.js**: Visualização de dados estatísticos.
*   **Vanilla CSS**: Estilização modular e responsiva, respeitando os padrões WCAG AAA.
*   **i18next (Custom)**: Sistema de internacionalização para 5 idiomas (PT, EN, ES, FR, DE).

### Backend
*   **Node.js & Express**: Servidor e framework web.
*   **MongoDB & Mongoose**: Base de dados NoSQL e ODM para persistência de dados.
*   **JWT (JSON Web Tokens)**: Autenticação segura de utilizadores.
*   **Bcryptjs**: Hashing de passwords.
*   **Express-Validator**: Validação de inputs no lado do servidor.
*   **Helmet & Mongo-Sanitize**: Segurança contra ataques comuns (XSS, Injection).

-------------------------------------------------------------------------------------------------------------

## Arquitetura do Sistema

O sistema segue uma arquitetura **MERN (MongoDB, Express, React, Node)**.
1.  **Client-Side**: O React gere o estado da aplicação e as rotas. Comunica com o backend via REST API.
2.  **Server-Side**: A API Express processa pedidos, valida autenticação via Middleware JWT e interage com o MongoDB.
3.  **Persistência**: Os dados de utilizadores, eventos e subscritores são armazenados de forma permanente no MongoDB,      substituindo a utilização anterior de IndexedDB para estes fins.

-------------------------------------------------------------------------------------------------------------

## Segurança e Performance
*   **Hashing de Passwords**: Nenhuma password é guardada em texto limpo.
*   **Proteção de Rotas**: Acesso ao painel administrativo (`/admin`) protegido por role-based access control (RBAC).
*   **Lazy Loading**: Componentes pesados como o `AdminPanel` são carregados apenas sob demanda para otimizar o tempo de carregamento inicial.
*   **Sanitização**: Filtros automáticos contra NoSQL Injection e headers de segurança via Helmet.

---------------------------------------------------------------------------------------------------------------

## Manual de Execução

### Pré-requisitos
*   Node.js instalado.
*   Instância de MongoDB a correr (local ou Atlas).

### Configuração do Backend
1.  Navegar para a pasta `backend`: `cd backend`
2.  Instalar dependências: `npm install`
3.  Configurar o ficheiro `.env` (usar `.env.example` como base):
    ```env
    MONGO_URI=mongodb://localhost:27017/caca
    JWT_SECRET=sua_chave_secreta_aqui
    PORT=5000
    ```
4.  Iniciar o servidor: `npm run dev`

### Configuração do Frontend
1.  Navegar para a pasta `frontend`: `cd frontend`
2.  Instalar dependências: `npm install`
3.  Configurar as chaves de API no ficheiro `public/config.js` (Google Maps, CurrentsAPI).
4.  Iniciar a aplicação: `npm run dev`

### Testes
*   No backend, correr `npm test` para executar os testes unitários de autenticação.

-------------------------------------------------------------------------------------------

## Acessibilidade (WCAG AAA)
O projeto mantém os rigorosos padrões de acessibilidade definidos nas fases iniciais:
*   Contraste de cores validado para daltonismo e baixa visão.
*   Fonte **Montserrat** para legibilidade (Dislexia).
*   Suporte a **Reduced Motion** via CSS.
*   Navegação por teclado e semântica HTML correta.
