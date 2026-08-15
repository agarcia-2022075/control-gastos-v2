# control-gastos

## 📌 Descripción del Proyecto
`control-gastos` es una aplicación web diseñada para la gestión y seguimiento eficiente de gastos personales o empresariales.

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **Angular** (TypeScript, HTML, CSS)
- **Angular Router**
- **HttpClient**

### Backend
- **Node.js**
- **Express**
- **TypeScript**
- **PostgreSQL** (Driver nativo `pg`)

### Gestor de Paquetes
- **pnpm** (pnpm workspace)

---

## 🛠️ Requisitos Previos e Instalación

### Requisitos
- **Node.js** (v18.0.0 o superior)
- **pnpm** (v8.0.0 o superior)
- **PostgreSQL** (v12.0 o superior)

### Instalación de Dependencias del Proyecto
Desde la raíz del proyecto, ejecuta:

```bash
pnpm install
```

---

## 🗄️ Configuración Manual de PostgreSQL

1. Abre **pgAdmin**, **DBeaver** o la consola **psql** de PostgreSQL.
2. Ejecuta el comando SQL para crear la base de datos:

   ```sql
   CREATE DATABASE control_gastos;
   ```

3. Conéctate a la base de datos `control_gastos` y ejecuta el script SQL para crear la tabla `users`:

   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL UNIQUE,
     password VARCHAR(255) NOT NULL,
     role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
     created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. Configura tus credenciales en el archivo `.env` local (basándote en `.env.example`):

   ```env
   PORT=3000

   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=control_gastos
   DB_USER=postgres
   DB_PASSWORD=admin

   ADMIN_EMAIL=admin@controlgastos.com
   ADMIN_PASSWORD=admin123

   JWT_SECRET=super_secret_jwt_key
   JWT_EXPIRES_IN=1h
   ```

5. Poblar el usuario administrador inicial (hasheado con bcryptjs):

   ```bash
   pnpm run db:seed
   ```

---

## 💻 Ejecución del Proyecto

### Workspace Raíz

El proyecto utiliza **pnpm workspaces** para gestionar el frontend y el backend desde la raíz:

- **Desarrollo completo (Frontend + Backend):**
  ```bash
  pnpm run dev
  ```
- **Desarrollo solo Frontend:**
  ```bash
  pnpm run dev:frontend
  ```
- **Desarrollo solo Backend:**
  ```bash
  pnpm run dev:backend
  ```
- **Compilación de todo el proyecto:**
  ```bash
  pnpm run build
  ```

---

## 🌐 Endpoints Disponibles

- **`GET /api/health`**: Verificación de estado de la API.
  ```json
  {
    "success": true,
    "message": "API funcionando correctamente"
  }
  ```
- **`GET /api/users`**: Listado de usuarios de la BD (sin contraseñas).
  ```json
  [
    {
      "id": 1,
      "name": "Administrator",
      "email": "admin@controlgastos.com",
      "role": "ADMIN",
      "createdAt": "2026-08-15T00:25:52.307Z",
      "updatedAt": "2026-08-15T00:25:52.307Z"
    }
  ]
  ```

---

## 📁 Estructura del Proyecto

```text
control-gastos/
├── frontend/             # Aplicación Angular (Fase 2)
├── backend/              # Aplicación Node.js + Express + TypeScript + PostgreSQL (Fase 3 & 4)
│   ├── src/
│   │   ├── config/       # Lectura de env.ts y pool de PostgreSQL (database.ts)
│   │   ├── middlewares/  # Manejo de errores (error.middleware.ts)
│   │   ├── modules/      # Módulo users (model, repository, service, controller, routes)
│   │   ├── routes/       # Rutas centralizadas (/api/health, /api/users)
│   │   ├── app.ts        # Express App
│   │   └── server.ts     # HTTP Listen y check de conexión DB
├── .env.example          # Plantilla de entorno
├── .gitignore            # Exclusiones de Git (.env, node_modules, dist)
└── README.md             # Documentación del proyecto
```
