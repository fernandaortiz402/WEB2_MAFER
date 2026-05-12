# 🍿 Movie Box

> **Tu videoclub digital con el espíritu de los clásicos.**

---

## 📌 Resumen del proyecto

**Movie Box** es el nombre comercial que ve el usuario en la interfaz: una plataforma de **películas** construida con el stack **MERN** (MongoDB, Express, React y Node.js). un **marketplace de películas**, con catálogo, carrito, órdenes y roles de **Cliente** y **Vendedor**.

La identidad visual sigue una línea **Blockbuster retro**: azul institucional `#003399` y amarillo de acento `#FFF000`, tipografía contundente y componentes que evocan la estética de videoclub físico (tarjetas con detalle tipo cinta / ticket).

En el código y en la API, la nomenclatura técnica está unificada en torno a **Movies** (modelos, controladores, rutas y servicios), de modo que el repositorio refleje de forma coherente el dominio actual.

---

## 🗂️ Arquitectura de archivos (post-refactorización)



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

**API REST de películas:**

---

## 🎬 Diseño de Base de Datos (EER)

La base de datos de **Movie Box** está diseñada con un enfoque en la gestión de películas, usuarios, órdenes y reseñas. Utilizamos **Mongoose** para el modelado de datos en **MongoDB Atlas/Local**, permitiendo una persistencia flexible y escalable.

### Colecciones Principales

- **Movies:** Contiene información detallada de cada película, incluyendo Título, Director, Duración, Género, Clasificación, Precio, Stock y referencia al Estudio (Company).
- **Users:** Almacena datos de usuarios como Nombre, Correo, Contraseña (hasheada), Rol (Cliente o Vendedor) y Foto de Perfil opcional.
- **Orders:** Registra las compras con referencia al Comprador, lista de películas adquiridas, Total de la orden y Fecha de creación.
- **Reviews/Comments:** Vincula usuarios con películas específicas, permitiendo Puntuación por estrellas y Comentarios textuales.

---

## 📼 Diseño de la API (Endpoints)

La API RESTful expone los siguientes endpoints para interactuar con el sistema:

| Recurso   | Método | Endpoint                     | Descripción                                                            |
| --------- | ------ | ---------------------------- | ---------------------------------------------------------------------- |
| Películas | GET    | `/api/movies`                | Lista todas las películas disponibles.                                 |
| Películas | POST   | `/api/movies`                | Crea una nueva película (solo para usuarios con rol Vendedor).         |
| Películas | GET    | `/api/movies/:id`            | Obtiene detalles de una película específica.                           |
| Usuarios  | POST   | `/api/users/register`        | Registra un nuevo usuario (con soporte para Multer en foto de perfil). |
| Usuarios  | POST   | `/api/users/login`           | Autentica a un usuario y devuelve un token JWT.                        |
| Órdenes   | POST   | `/api/orders`                | Crea una nueva orden de compra.                                        |
| Órdenes   | GET    | `/api/orders/my-orders`      | Obtiene el historial de compras del usuario autenticado (Cliente).     |
| Órdenes   | GET    | `/api/orders/reporte-ventas` | Genera un reporte de ventas (solo para Vendedores).                    |

---

## 🍿 Listado de Rutas del Frontend

El frontend de React maneja las siguientes rutas, organizadas por nivel de acceso:

### Públicas

| Ruta            | Descripción                               |
| --------------- | ----------------------------------------- |
| `/`             | Página de inicio (Home).                  |
| `/catalog`      | Catálogo de películas disponibles.        |
| `/producto/:id` | Detalle de una película específica.       |
| `/auth`         | Página de autenticación (Login/Registro). |

### Protegidas (Requieren autenticación)

| Ruta                  | Descripción                                       |
| --------------------- | ------------------------------------------------- |
| `/cart`               | Carrito de compras.                               |
| `/profile`            | Perfil del usuario.                               |
| `/mis-compras`        | Historial de compras del cliente.                 |
| `/detalle-compra/:id` | Detalle de una compra específica (Ticket/Review). |

### Vendedor

| Ruta              | Descripción                                |
| ----------------- | ------------------------------------------ |
| `/nuevo-producto` | Formulario para añadir una nueva película. |
| `/reporte-ventas` | Dashboard de reporte de ventas.            |

---

## 🎥 Tecnologías (Ampliación)

**Movie Box** se construye sobre un stack moderno y robusto:

### Backend

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework web para crear la API REST.
- **Multer**: Middleware para manejo de archivos multipart (imágenes de películas y perfiles).
- **Bcrypt**: Librería para hashing de contraseñas y seguridad.
- **JWT**: Para autenticación basada en tokens.

### Frontend

- **React**: Librería para construir interfaces de usuario.
- **Context API**: Para gestión de estado global (autenticación, carrito, películas).
- **Axios**: Cliente HTTP para peticiones a la API.
- **Framer Motion**: Para animaciones, incluyendo efectos de palomitas.
- **Canvas-confetti**: Para efectos visuales de confeti.

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

_(El script `blockbuster` de la raíz también ejecuta `npm install` en el server antes del seed.)_

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

| Variable          | Descripción                                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **`MONGODB_URI`** | Cadena de conexión a MongoDB (por ejemplo `mongodb://localhost:27017/movie_paradise_db`). **Obligatoria** para persistencia y seeds. |
| **`JWT_SECRET`**  | Secreto para firmar tokens JWT en login y registro. **Obligatoria** en producción.                                                   |
| **`PORT`**        | Puerto del API (por defecto **3000** si se omite).                                                                                   |

### Frontend (`client/.env.development`)

| Variable                   | Descripción                                                                                                                                                                        |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`PORT`**                 | Puerto del dev server de React (recomendado **3001** para no chocar con el API).                                                                                                   |
| **`REACT_APP_API_ORIGIN`** | Origen del API para resolver URLs absolutas (p. ej. imágenes de perfil en `/uploads`). Ejemplo: `http://localhost:3000`. Útil cuando el proxy de CRA no aplica a ciertos recursos. |

Además, en **`client/package.json`** el campo **`proxy`** apunta a **`http://localhost:3000`** para que las peticiones relativas `/api/...` lleguen al backend en desarrollo.

---

## 👥 Equipo de desarrollo

| Nombre                        | Matrícula |
| ----------------------------- | --------- |
| MARIA FERNANDA ORTIZ CARRILLO | 2002086   |

---

## 📝 Notas finales

- El nombre **Movie Box** identifica la experiencia de usuario; el repositorio puede conservar nombres de paquete heredados (`movie-paradise`, etc.) sin afectar la narrativa comercial en la UI.
- Cualquier ampliación del dominio (nuevas rutas, modelos o seeds) debe seguir la convención **Movies** y mantener coherencia con `/api/movies`.

