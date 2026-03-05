# Saas Plantilla - Documentación Global

## Estructura Principal de Rutas

El proyecto sigue una separación estricta de responsabilidades por ruta para la aplicación frontend:

### `/` (Ruta Inicial / Landing Page)
- **Propósito**: Landing page del SaaS (ej. "reservaapp.com").
- **Funcionalidad**: 
  - Registro de nuevos negocios (selección de nicho, planes de suscripción).
  - Directorio público de negocios suscritos al SaaS.
  - Sistema de promoción donde los negocios pueden pagar para aparecer destacados o en los primeros resultados.
- **Acceso**: Público.

### `/[slug]` (Página Pública del Negocio)
- **Propósito**: Página orientada al cliente final del negocio.
- **Funcionalidad**: Plantilla específica del tenant (negocio) donde el usuario final entra a solicitar el servicio.
- **Ejemplo**: Para un nicho de reservas, aquí el cliente verá los horarios disponibles, catálogo de servicios, perfiles de los profesionales (ej. peluqueros) y gestionará su reserva.
- **Acceso**: Público.

### `/auth` (Autenticación Interna)
- **Propósito**: Gestión de acceso para empleados del tenant.
- **Funcionalidad**: Pantallas de login, recuperación de contraseña, etc.
- **Acceso**: Exclusivo para personal del negocio (roles: Admin, Owner, Staff). No es para clientes finales.

### `/dashboard` (Administración Interna)
- **Propósito**: Panel de control del negocio.
- **Funcionalidad según el rol**:
  - **Owner / Admin**: Administración integral del negocio. Tienen acceso completo a la gestión de usuarios (staff), configuraciones del tenant, facturación, servicios, etc.
  - **Staff**: Vista limitada. Solo pueden acceder a información referente a su propio perfil, horarios asignados, reservas propias u otra gestión delegada a su rol.
- **Acceso**: Protegido (Requiere estar autenticado).
