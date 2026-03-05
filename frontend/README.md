# Frontend SaaS Multi-Tenant Template

Plantilla cliente para el SaaS Multi-Tenant construida sobre Next.js (App Router), enfocada en consumir una API REST genérica.

## Características Principales

- **Arquitectura Híbrida**: SSR para páginas públicas/SEO y CSR para dashboards administrativos.
- **Gestión de Estado**: `zustand` para sesión y configuración de tenant, React Query (`@tanstack/react-query`) para peticiones asíncronas y caché.
- **Formularios**: `react-hook-form` con validación mediante `zod`.
- **UI & Estilos**: Tailwind CSS v4, `lucide-react`, y Shadcn UI. Componentes altamente interactivos y layouts pulidos.
- **Sidebar Dinámico**: Soporte para menús colapsables, detección de rutas activas y control de acceso por roles (RBAC).
- **Axios**: Cliente HTTP preconfigurado con interceptores para JWT.
- **Internacionalización (i18n)**: Configurado con `next-intl`. Detección automática por cookie/request y traducciones centralizadas.

## Setup Inicial

### 1. Variables de Entorno
Crea un archivo `.env.local` basado en la configuración necesaria:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME="Reserva App"
```

### 2. Instalación de Dependencias

```bash
pnpm install
```

### 3. Ejecutar en Local

```bash
pnpm dev
```

## Estructura de Rutas

- `/`: Landing page pública con soporte i18n (`/[locale]`).
- `/auth/*`: Rutas de login, recuperación y onboarding (`/auth/onboarding`).
- `/[slug]`: Página pública del Tenant (SSR).
- `/dashboard/admin`: Panel para administradores (roles `OWNER`).
- `/dashboard/staff`: Panel para empleados (rol `STAFF`).
- `/dashboard/root`: Panel de Superadmin (rol `SUPERADMIN`).
- `/settings/*`: Edición de perfil y tenant.

## Estado del Proyecto (Highlights)

- [X] Crear layout privado base (Dashboard Layout: Sidebar colapsable, Top Navigation, User Dropdown).
- [X] Crear UI para el panel `SUPERADMIN` (`/dashboard/root`).
- [X] Crear UI para el panel `OWNER` (`/dashboard/admin`).
- [X] Crear UI para el panel `STAFF` (`/dashboard/staff`).

## Componentes Compartidos (Shadcn UI)

Instalación y añadido de componentes mediante CLI:

```bash
pnpm dlx shadcn@latest add [component-name]
```
