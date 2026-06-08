# Progreso — Migración Proptech InmoYa

> Estado vivo de la migración del stack legacy (Express + HTML) a **Next.js + TS + Tailwind**.
> Última actualización: 2026-06-08.

## Estado general

🟡 **Fase 0 — Planificación.** Plan definido y documentado. Aún no se arranca el proyecto Next.

## Decisiones tomadas

- **Framework:** Next.js 15 (App Router) — elegido por SEO (SSR/SSG), clave en inmobiliaria.
- **No** separar en 2 proyectos (Vite + Express): over-engineering para este tamaño.
- **Gestor de paquetes:** pnpm (no npm) — seguridad supply-chain (`minimum-release-age`) + ya se usa.
- **Datos:** primero mocks tipados en `lib/data.ts`, luego Supabase.
- **Puerto legacy:** 3005 (el 3000 lo ocupa Easypanel en el VPS).

## Checklist de migración

- [ ] Proyecto Next.js creado con pnpm (TS + Tailwind + App Router)
- [ ] `base.css` migrado a Tailwind theme / `globals.css`
- [ ] `<Navbar/>` funcionando (menú móvil con `useState`)
- [ ] Vista `index` migrada (prueba del patrón)
- [ ] Resto de vistas migradas (propiedades, agencias, nosotros, contacto, ingresar)
- [ ] Mocks movidos a `lib/data.ts` tipados
- [ ] Route Handlers o Server Components leyendo datos
- [ ] Integración Supabase (datos reales + auth)
- [ ] Deploy (Vercel o VPS con PM2)
- [ ] Retirar el stack legacy de `inmobiliaria/`

## Próximo paso

Arrancar el proyecto Next al lado del legacy:

```bash
pnpm create next-app@latest web --ts --tailwind --app
```

Luego migrar la vista `index` como prueba del patrón antes de seguir con el resto.
