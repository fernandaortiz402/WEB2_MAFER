# Comandos para correr el proyecto (Movie Box)

Ruta base del repo (ajusta si tu carpeta tiene otro nombre):

```text
cd "c:\Users\juane\Downloads\pia final games 1\Mi_prograweb2-main"
```

---

## Opción A — Todo en uno (recomendado)

Desde la **raíz** del proyecto (`Mi_prograweb2-main`):

```powershell
npm install
npm run blockbuster
```

- API: **http://localhost:3000**
- Front: **http://localhost:3001**

---

## Opción B — Pasos manuales

### 1) Instalar dependencias (raíz, server y client)

**PowerShell (Windows):**

```powershell
cd "c:\Users\juane\Downloads\pia final games 1\Mi_prograweb2-main"
npm install
npm install --prefix server
npm install --prefix client
```

**Bash (macOS / Linux / Git Bash):**

```bash
cd "/ruta/a/Mi_prograweb2-main"
npm install
npm install --prefix server
npm install --prefix client
```

### 2) Seed de películas (una vez o cuando quieras resetear datos de demo)

```powershell
npm run seed:movies
```

### 3) Arrancar API y cliente (dos terminales)

**Terminal 1 — backend:**

```powershell
cd "c:\Users\juane\Downloads\pia final games 1\Mi_prograweb2-main\server"
npm run dev
```

**Terminal 2 — frontend:**

```powershell
cd "c:\Users\juane\Downloads\pia final games 1\Mi_prograweb2-main\client"
npm start
```

---

## Requisitos

- **MongoDB** en marcha y `MONGODB_URI` + `JWT_SECRET` en `server/.env`
- En el client, `client/.env.development` con `PORT=3001` y `REACT_APP_API_ORIGIN=http://localhost:3000` (ver `README.md`)

---

## Si el puerto 3000 o 3001 está ocupado (PowerShell)

```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
```

Luego vuelve a ejecutar `npm run blockbuster` o los dos `npm run dev` / `npm start`.
