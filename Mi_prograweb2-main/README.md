# 🍿 Movie Box

> **Tu videoclub digital con el espíritu de los clásicos.**

---

## 📌 Resumen del proyecto

**Movie Box** es el nombre comercial que ve el usuario en la interfaz: una plataforma de **películas** construida con el stack **MERN** (MongoDB, Express, React y Node.js). El proyecto evolucionó desde una concepción inicial orientada a **Game Paradise** (tienda de juegos) hacia un **marketplace de películas**, con catálogo, carrito, órdenes y roles de **Cliente** y **Vendedor**.

La identidad visual sigue una línea **Blockbuster retro**: azul institucional `#003399` y amarillo de acento `#FFF000`, tipografía contundente y componentes que evocan la estética de videoclub físico (tarjetas con detalle tipo cinta / ticket).

En el código y en la API, la nomenclatura técnica está unificada en torno a **Movies** (modelos, controladores, rutas y servicios), de modo que el repositorio refleje de forma coherente el dominio actual.

---

## 🗂️ Arquitectura de archivos (post-refactorización)

Tras el renombrado masivo, la correspondencia conceptual es la siguiente (los nombres antiguos ya no existen en el repositorio):

| Antes (referencia histórica) | Ahora |
|------------------------------|--------|
| `Model_games.js` | `server/Models/Model_movies.js` |
| `gamecontroller.js` | `server/Controllers/movieController.js` |
| `Routes/Games.js` | `server/Routes/Movies.js` |
| `middleware/upload.js` (subida de imágenes de película) | `server/middleware/uploadMovies.js` |
| `gameService.js` | `client/src/services/movieService.js` |
| `GameContext.js` | `client/src/context/MovieContext.js` |
| `components/games/` | `client/src/components/movies/` |

Árbol orientativo de las carpetas principales (sin `node_modules`):

```text
Mi_prograweb2-main/
├── package.json                 # Scripts monorepo (blockbuster, seed, etc.)
├── README.md
├── server/
│   ├── index.js                 # Express, CORS, /api/movies, /uploads
│   ├── .env                     # JWT_SECRET, MONGODB_URI, PORT (no versionar secretos)
│   ├── Models/
│   │   ├── Model_movies.js      # Esquema Mongoose "Movies"
│   │   ├── Model_user.js
│   │   └── …
│   ├── Controllers/
│   │   ├── movieController.js
│   │   ├── userController.js
│   │   ├── orderController.js
│   │   └── …
│   ├── Routes/
│   │   ├── Movies.js            # Montado en app como /api/movies
│   │   ├── User.js
│   │   ├── Orders.js
│   │   └── …
│   ├── middleware/
│   │   ├── uploadMovies.js      # Multer: imágenes de película (campo imagenes)
│   │   ├── uploadRegister.js    # Multer: foto de perfil en registro
│   │   └── …
│   ├── scripts/
│   │   └── seedMovies.js        # Datos iniciales de películas
│   └── uploads/                 # Archivos estáticos servidos en /uploads
└── client/
    ├── package.json             # proxy → http://localhost:3000
    ├── .env.development         # PORT, REACT_APP_API_ORIGIN (ver sección de entorno)
    └── src/
        ├── App.js
        ├── context/
        │   ├── MovieContext.js
        │   └── …
        ├── services/
        │   ├── movieService.js
        │   └── …
        ├── components/
        │   ├── movies/
        │   │   ├── MovieCard.js
        │   │   ├── MovieGrid.js
        │   │   └── MovieFilters.js
        │   └── …
        ├── hooks/
        │   └── useMovies.js     # Reexporta useMovies del contexto
        ├── pages/
        └── styles/
```

**API REST de películas:** todas las operaciones del catálogo y detalle se exponen bajo el prefijo **`/api/movies`** (no `/api/games`).

---

## ✨ Nuevas funcionalidades implementadas

### 🧑‍💼 Registro personalizado

Los usuarios pueden registrarse con **foto de perfil** opcional. El backend usa **Multer** (`uploadRegister.js`), guarda archivos en `server/uploads` y devuelve la ruta pública (`/uploads/...`). El frontend envía los datos como **`FormData`** para preservar el `boundary` correcto del multipart.

### 📊 Dashboard de vendedor

Los usuarios con rol **Vendedor** acceden al **reporte de ventas**: métricas de ingresos, unidades vendidas y **filtros por fecha**, con tablas alineadas a la estética Blockbuster (cabecera azul / texto amarillo).

### 🛒 Experiencia del comprador

- **Detalle de compra** tras la compra, con información de la orden.
- **Calificación por estrellas** y **comentarios** vinculados a la película correspondiente, integrados con las rutas de comentarios y valoraciones del backend.

---

## 🚀 Guía de inicio rápido

### Requisitos previos

- **Node.js** (LTS recomendado)
- **MongoDB** en ejecución y URI accesible

### Instalación de dependencias

Desde la raíz del repositorio (`Mi_prograweb2-main`):

```bash
npm install
```

Instalación explícita en **server** y **client** (útil en CI o primera clonación):

```bash
npm install --prefix server
npm install --prefix client
```

*(El script `blockbuster` de la raíz también ejecuta `npm install` en el server antes del seed.)*

### Población inicial de datos (películas)

```bash
npm run seed:movies
```

Equivale a `npm run seed:movies` dentro de `server/` y crea el conjunto inicial de películas en la base configurada.

### Arranque completo (API + frontend)

```bash
npm run blockbuster
```

Este comando:

1. Instala dependencias del **server** (incluye **multer** y el resto de dependencias del API).
2. Ejecuta **`npm run seed:movies`** en el server.
3. Levanta en paralelo:
   - **API (Express):** por defecto **http://localhost:3000**
   - **Frontend (React):** **http://localhost:3001** (según `client/.env.development`)

Para desarrollo manual en dos terminales:

```bash
cd server && npm run dev
cd client && npm start
```

---

## 🔐 Variables de entorno

### Backend (`server/.env`)

| Variable | Descripción |
|----------|-------------|
| **`MONGODB_URI`** | Cadena de conexión a MongoDB (por ejemplo `mongodb://localhost:27017/movie_paradise_db`). **Obligatoria** para persistencia y seeds. |
| **`JWT_SECRET`** | Secreto para firmar tokens JWT en login y registro. **Obligatoria** en producción. |
| **`PORT`** | Puerto del API (por defecto **3000** si se omite). |

### Frontend (`client/.env.development`)

| Variable | Descripción |
|----------|-------------|
| **`PORT`** | Puerto del dev server de React (recomendado **3001** para no chocar con el API). |
| **`REACT_APP_API_ORIGIN`** | Origen del API para resolver URLs absolutas (p. ej. imágenes de perfil en `/uploads`). Ejemplo: `http://localhost:3000`. Útil cuando el proxy de CRA no aplica a ciertos recursos. |

Además, en **`client/package.json`** el campo **`proxy`** apunta a **`http://localhost:3000`** para que las peticiones relativas `/api/...` lleguen al backend en desarrollo.

---

## 👥 Equipo de desarrollo

| Nombre                        | Matrícula |
|-------------------------------|-----------|
| MARIA FERNANDA ORTIZ CARRILLO | 2002086   |


---

## 📝 Notas finales

- El nombre **Movie Box** identifica la experiencia de usuario; el repositorio puede conservar nombres de paquete heredados (`movie-paradise`, etc.) sin afectar la narrativa comercial en la UI.
- Cualquier ampliación del dominio (nuevas rutas, modelos o seeds) debe seguir la convención **Movies** y mantener coherencia con `/api/movies`.

*Documentación generada para fines académicos y de entrega del proyecto.*
