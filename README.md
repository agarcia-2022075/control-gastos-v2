# control-gastos

## 📌 Descripción del Proyecto
`control-gastos` es una aplicación web diseñada para la gestión y seguimiento eficiente de gastos personales o empresariales.

En esta **Fase 1**, el objetivo exclusivo es establecer e inicializar la estructura base del proyecto, workspace con pnpm, configuración del frontend y backend, y definir el flujo de trabajo en Git.

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **Angular** (TypeScript, HTML, CSS)
- **Angular Router**

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
     "message": "API funcionando correctamente"
   }
   ```

---

## 📁 Estructura Inicial del Proyecto

```text
control-gastos/
├── frontend/             # Aplicación Angular
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── backend/              # Aplicación Node.js + Express + TypeScript
│   ├── src/
│   │   ├── app.ts        # Instancia y middlewares de Express
│   │   └── server.ts     # Entrada del servidor HTTP (listen)
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
