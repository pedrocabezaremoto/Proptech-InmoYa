# Historial — Proptech InmoYa

> Registro cronológico de decisiones y cambios del proyecto.

## 2026-06-08

- **Análisis del proyecto legacy.** Confirmado que es una landing inmobiliaria estática:
  Express 5 sirviendo 7 vistas HTML, datos mock en memoria (3 propiedades, 3 agencias),
  API mínima (`/api/properties`, `/api/agencies`). Sin DB ni auth real.
- **Decisión de stack.** Se elige migrar a **Next.js 15 (App Router) + TypeScript +
  Tailwind CSS v4**, en lugar de la propuesta de separar frontend (Vite) y backend
  (Express) en 2 proyectos. Razón principal: SEO (SSR/SSG) y un solo repo/deploy.
- **Gestor de paquetes.** Se descarta npm por riesgo de supply-chain (paquetes
  comprometidos recientes). Se adopta **pnpm** con `minimum-release-age` como cooldown.
- **README de migración** creado en `inmobiliaria/README.md` con el plan completo
  (estado actual, stack objetivo, pasos, estructura, checklist).
- **Puerto legacy** cambiado de 3000 → **3005** (el 3000 lo usa Easypanel en el VPS).
- **Archivos de seguimiento** creados: `Progreso.md` (estado vivo) e `Historial.md` (este).
