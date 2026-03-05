# Plan de Construcción: Frontend SaaS Multi-Tenant Template

Este documento define la arquitectura, diseño y fases de implementación para el frontend cliente del SaaS Multi-Tenant. Este frontend será una plantilla genérica diseñada para consumir la API REST construida en Node/Express.

## 1. Stack Tecnológico

- **Framework**: Next.js 16+ (App Router).
- **Estilos**: Tailwind CSS + Shadcn UI.
- **Rendimiento e Imágenes**: `next/image` configurado para optimizar URLs estáticas del bucket S3 (Supabase).
- **Estado y Peticiones**:
  - `axios` (para llamadas HTTP con interceptores JWT).
  - `@tanstack/react-query` (caché, paginación, y revalidación asíncrona).
  - `zustand` (estado global ligero, gestión de la sesión y tenant activo).
- **Formularios**: `react-hook-form` + `@hookform/resolvers/zod` (reutilizando los esquemas del backend si se monorepo o duplicando lógica controlada).

## 2. Pautas Arquitectónicas (SPA Híbrida)

- **SSR (Server-Side Rendering)**: Exclusivo para rutas públicas orientadas al SEO del tenant (ej. `/[slug]`).
- **CSR (Client-Side Rendering)**: Dashboards administrativos (`/dashboard/*`). Minimiza la carga de los servidores Next.js y delega la responsabilidad al API Express.

## 3. Estructura de Rutas (App Router)

### Públicas y Autenticación

- `/`: Landing page de la plantilla SaaS (Marketing, Pricing).
- `/auth/login`: Formulario de inicio de sesión genérico.
- `/auth/onboarding`: Flujo público de registro (`/api/auth/register-tenant`). Otorga rol `OWNER` por defecto.
- `/auth/reset-password`: Flujo de recuperación (dependiente de la integración de correo).

### Cliente Final (Tenant Páginas Públicas)

- `/[slug]`: Perfil público del Tenant (consumo SSR). Muestra el logo (`logoUrl`), colores y formulario de reservas.

### Dashboards Protegidos

- `/dashboard/root`: (Opcional) Panel exclusivo para rol `SUPERADMIN` (gestión de tenants).
- `/dashboard/admin`: Panel para rol `OWNER`.
  - `/dashboard/admin/settings`: Actualización del tenant (tema, logoUrl). Llama a `PATCH /api/tenants/:id`.
  - `/dashboard/admin/team`: Gestión del staff. Llama a `GET /api/tenants/:id/invitations` y `POST /api/users`.
  - `/dashboard/admin/billing`: Integración con Stripe. Rutas `POST /api/billing/checkout` y `/portal`.
- `/dashboard/staff`: Panel para rol `STAFF`.
  - Calendario y asignaciones propias.
- `/settings/profile`: Actualización del perfil (foto `avatarUrl`, nombre). Llama a `PATCH /api/users/:id`.

## 4. Gestión de Estado y Autenticación

- **Axios Interceptors**: Extrae el JWT de `localStorage` o cookies y lo inyecta en el header `Authorization: Bearer <token>`.
- **Zustand Auth Store**:
  - `user`: Datos del endpoint `/api/auth/me`.
  - `activeTenant`: ID e info del tenant actual.
  - `roles`: Determinación renderizado condicional de la UI (ej. ocultar Billing al rol `STAFF`).
- **Storage Workflow**:
  - El frontend pide la firma: `POST /api/storage/presigned-url`.
  - El frontend hace un `PUT` directo a la URL de S3 con el `File`.
  - El frontend llama a `PATCH /api/users/me` o `PATCH /api/tenants/:id` con la URL pública para actualizar la BD.

## 5. Fases de Desarrollo

### Fase 1: Setup e Infraestructura

1. Inicializar Next.js con Tailwind y TypeScript.
2. Configurar estructura base (`app/`, `components/`, `lib/`, `hooks/`).
3. Instalar dependencias clave (Shadcn, React Query, Axios, Zustand).
4. Crear instancia de Axios con interceptores de Auth.

### Fase 2: Autenticación y Onboarding

1. UI completa para `/auth/login` y llamadas al endpoint.
2. Crear `AuthGuard` component para proteger rutas `/dashboard`.
3. Implementar `/auth/onboarding` para consumir `/register-tenant`.

### Fase 3: Rutas Públicas de Tenants (SSR)

1. Ruta dinámica límite `/[slug]`.
2. Habilitar la llamada SSR desde el `page.tsx` hacia nuestro Express para hidratar los metadatos y UI.
3. Componente público de reserva genérico adaptable a `settings.themeColors`.

### Fase 4: Dashboards Base (CSR)

1. Layout privado compartido (Sidebar, Topbar).
2. Panel `/dashboard/admin` y `/dashboard/staff`.
3. Pantalla de ajustes (Settings) para actualizar Perfil de Usuario y Perfil del Tenant, aplicando la subida a S3 (storage).
4. Componente tabla con Paginación (conectando el paginador de la API).

### Fase 5: Módulo Administrativo y Stripe

1. Vista de Miembros de Equipo (invitar, desactivar, reactivar).
2. Vista de Facturación conectando `/api/billing/checkout`.

## 6. Siguientes Pasos

Una vez se apruebe esta planificación, se debe crear un nuevo proyecto Next.js (`pnpm create next-app frontend`) e iniciar con la **Fase 1**.
