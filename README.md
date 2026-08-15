# control-gastos

## 📌 Descripción del Proyecto
`control-gastos` es una aplicación web diseñada para la gestión y seguimiento eficiente de gastos personales o empresariales.

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **Angular** (TypeScript, HTML, CSS)
- **Angular Router**
- **HttpClient** con Interceptores y Guards
- **Reactive Forms**

### Backend
- **Node.js**
- **Express**
- **TypeScript**
- **PostgreSQL** (Driver `pg`)
- **JSON Web Token (`jsonwebtoken`)**
- **hashing de contraseñas (`bcryptjs`)**

### Gestor de Paquetes
- **pnpm** (pnpm workspace)

---

## 🔐 Sistema de Autenticación y Autorización (Fases 5 y 6)

### Diferencia entre Autenticación y Autorización
- **Autenticación (¿Quién eres?)**: Proceso mediante el cual el usuario demuestra su identidad mediante email y contraseña (`POST /api/auth/login`). Si la autenticación falla o el token falta/expira, el servidor retorna el código de estado **`401 Unauthorized`**.
- **Autorización (¿Qué puedes hacer?)**: Proceso mediante el cual el servidor verifica si el usuario autenticado tiene los permisos necesarios (`UserRole`) para acceder a un recurso o ejecutar una acción. Si no los tiene, el servidor retorna **`403 Forbidden`**.

### Roles Oficiales del Sistema
El sistema define estrictamente dos roles mediante el tipo `UserRole`:
1. **`USER`**: Rol asignado por defecto a todos los registros públicos (`POST /api/auth/register`). Puede acceder al `/dashboard` y a sus propios datos (`GET /api/auth/me`).
2. **`ADMIN`**: Rol administrativo. Puede acceder a rutas administrativas (`GET /api/admin/test`), listar usuarios (`GET /api/users`) y cambiar roles (`PATCH /api/users/:id/role`).

> ⚠️ **Regla de Seguridad Fundamental**: El backend (`Express + PostgreSQL`) es la autoridad final de seguridad. La interfaz Angular oculta o muestra enlaces para mejorar la UX, pero todos los endpoints están fuertemente protegidos en backend. El middleware de autorización consulta PostgreSQL en tiempo real para evitar decisiones basadas en tokens antiguos con roles desactualizados.

---

## 📡 Endpoints de la API

| Método | Endpoint | Middleware / Protección | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Público | Comprobación del estado de la API |
| `POST` | `/api/auth/register` | Público | Registro de usuarios (siempre rol `USER`) |
| `POST` | `/api/auth/login` | Público | Autenticación y emisión de JWT |
| `GET` | `/api/auth/me` | `authenticateJwt` | Retorna los datos del usuario autenticado |
| `GET` | `/api/admin/test` | `authenticateJwt` + `authorizeRole('ADMIN')` | Prueba exclusiva para administradores |
| `GET` | `/api/users` | `authenticateJwt` + `authorizeRole('ADMIN')` | Lista de usuarios sin contraseñas |
| `PATCH` | `/api/users/:id/role` | `authenticateJwt` + `authorizeRole('ADMIN')` | Actualización de rol (`USER` ↔ `ADMIN`) |

---

## 🛠️ Requisitos Previos e Instalación

### Requisitos
- **Node.js** (v18.0.0 o superior)
- **pnpm** (v8.0.0 o superior)
- **PostgreSQL** (v12.0 o superior, BD: `control_gastos`)

### Instalación de Dependencias del Proyecto
Desde la raíz del proyecto, ejecuta:

```bash
pnpm install
```

### Migraciones y Semilla Inicial
```bash
# Ejecutar migración de la tabla users:
pnpm --filter backend run db:migrate

# Ejecutar semilla para crear el usuario ADMIN inicial (admin@controlgastos.com):
pnpm --filter backend run db:seed
```

---

## 💻 Ejecución del Proyecto

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

## 📁 Estructura del Proyecto

```text
control-gastos/
├── frontend/             # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/     # Guards (auth, role), Interceptors (auth), Services (auth)
│   │   │   ├── features/ # Home, Dashboard, Auth (login, register), Admin
│   │   │   └── shared/
│   │   └── environments/
│   ├── package.json
│   └── tsconfig.json
├── backend/              # Aplicación Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/       # Variables de entorno y Pool PostgreSQL
│   │   ├── middlewares/  # auth.middleware.ts, role.middleware.ts, error.middleware.ts
│   │   ├── modules/      # admin, auth, users
│   │   ├── routes/       # Rutas centralizadas (/api/auth, /api/admin, /api/users)
│   │   └── server.ts     # Servidor HTTP Express
│   ├── package.json
│   └── tsconfig.json
├── .env.example          # Plantilla de variables de entorno
├── package.json          # Workspace raíz
└── README.md             # Documentación del proyecto
```

---

## 🌿 Flujo de Ramas Git

El repositorio utiliza una estrategia de tres ramas principales:

```text
main
  │
  └── develop
        │
        └── agarcia-2022075
```

- **`main`**: Rama principal de producción.
- **`develop`**: Rama de integración del proyecto.
- **`agarcia-2022075`**: Rama de trabajo personal donde se realizan los desarrollos de cada fase.
