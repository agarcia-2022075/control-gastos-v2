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

### Gestor de Paquetes
- **pnpm** (pnpm workspace)

---

## 🛠️ Requisitos Previos e Instalación

### Requisitos
- **Node.js** (v18.0.0 o superior)
- **pnpm** (v8.0.0 o superior)

### Instalación de pnpm
Si no tienes `pnpm` instalado, puedes instalarlo globalmente ejecutando:

```bash
npm install -g pnpm
# O utilizando Corepack:
corepack enable
corepack prepare pnpm@latest --activate
```

### Instalación de Dependencias del Proyecto
Desde la raíz del proyecto, ejecuta:

```bash
pnpm install
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

## 🌐 Comprobación del Backend

Para verificar que el backend funciona correctamente:

1. Inicia el servidor backend:
   ```bash
   pnpm run dev:backend
   ```
2. Realiza una petición `GET` a la ruta de salud de la API:
   - URL: `http://localhost:3000/api/health`
3. Respuesta esperada:
   ```json
   {
     "success": true,
     "message": "API funcionando correctamente"
   }
   ```

---

## 📁 Estructura del Proyecto

```text
control-gastos/
├── frontend/             # Aplicación Angular (Fase 2)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/     # Guards, Interceptors, Services, Models
│   │   │   ├── features/ # Home, Dashboard, Auth, Admin
│   │   │   └── shared/   # Components, Models
│   │   └── environments/
│   ├── package.json
│   └── tsconfig.json
├── backend/              # Aplicación Node.js + Express + TypeScript (Fase 3)
│   ├── src/
│   │   ├── config/       # Lectura de variables de entorno (env.ts)
│   │   ├── middlewares/  # Manejo centralizado de errores (error.middleware.ts)
│   │   ├── modules/      # Módulos auth y users preparados
│   │   ├── routes/       # Rutas centralizadas (/api/health)
│   │   ├── app.ts        # Instancia y middlewares de Express
│   │   └── server.ts     # Inicialización del servidor HTTP (listen)
│   ├── package.json
│   └── tsconfig.json
├── .env.example          # Plantilla de variables de entorno
├── .gitignore            # Exclusiones para el control de versiones
├── package.json          # Workspace raíz
├── pnpm-workspace.yaml   # Configuración de workspace pnpm
├── pnpm-lock.yaml        # Reproducibilidad de dependencias
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

- **`main`**: Rama principal de producción. Debe mantenerse limpia sin código directo de desarrollo.
- **`develop`**: Rama de integración del proyecto.
- **`agarcia-2022075`**: Rama de trabajo personal donde se realizan los desarrollos de cada fase.

Los cambios se integran hacia `develop` mediante Pull Requests.
