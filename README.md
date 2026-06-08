# Proptech InmoYa

Plataforma inmobiliaria. Este documento describe el **plan de migración** del stack actual
(Express + HTML estático) a un stack moderno **Next.js + TypeScript + Tailwind CSS**.

---

## 1. Estado actual (lo que hay hoy)

Stack legacy, en la carpeta `inmobiliaria/`:

- **Express 5** sirviendo 7 vistas HTML estáticas (`server.js`).
- **Datos mock en memoria**: 3 propiedades y 3 agencias hardcodeadas en `server.js`.
- Frontend plano: `public/views/*.html`, `public/css/*.css`, `public/js/menu.js`.
- API mínima: `GET /api/properties` y `GET /api/agencies`.
- Sin base de datos, sin autenticación real, sin estado complejo.

Es esencialmente una **landing inmobiliaria estática** con datos de ejemplo.

---

## 2. Stack objetivo (a dónde vamos)

| Capa            | Tecnología                              | Por qué                                              |
|-----------------|------------------------------------------|------------------------------------------------------|
| Framework       | **Next.js 15** (App Router)               | SSR/SSG nativo → **SEO**, clave en inmobiliaria      |
| Lenguaje        | **TypeScript**                            | Tipado, menos bugs                                   |
| Estilos         | **Tailwind CSS v4**                       | Estándar actual, rápido de iterar                    |
| Componentes UI  | **shadcn/ui**                             | Cards de propiedades, forms                          |
| Datos (futuro)  | **Supabase** (Postgres + Auth)            | Reemplaza los mocks; habilita login real `/ingresar` |
| Deploy          | **Vercel** (1 click) o **VPS con PM2**    | Según preferencia de control                         |
| Gestor de paq.  | **pnpm** (ver sección 6)                  | Seguridad + velocidad                                |

**Por qué Next.js y no React+Vite separado del backend:** el proyecto es pequeño y
SEO-dependiente. Un solo repo/deploy con SSR nativo es mejor que mantener 2 proyectos
(frontend Vite + backend Express) para servir unos pocos datos. Separar tendría sentido
solo si el backend fuera pesado o compartido por varias apps.

---

## 3. Plan de migración (paso a paso)

> **Regla:** no migrar in-place. Se arranca un proyecto Next limpio (carpeta nueva, ej.
> `web/`) y se mueve archivo por archivo. Lo legacy en `inmobiliaria/` se conserva hasta
> validar la migración.

1. **Arranque del proyecto**
   ```bash
   pnpm create next-app@latest web --ts --tailwind --app
   ```
   (TypeScript + Tailwind + App Router).

2. **CSS → Tailwind**
   - `base.css` (variables, layout global) → configuración de Tailwind (`globals.css` +
     theme).
   - El resto de CSS (`propiedades.css`, `agencias.css`, etc.) → clases utility en cada
     componente.

3. **HTML → páginas (routing por carpetas)**
   - `index.html`        → `app/page.tsx`
   - `propiedades.html`  → `app/propiedades/page.tsx`
   - `agencias.html`     → `app/agencias/page.tsx`
   - `nosotros.html`     → `app/nosotros/page.tsx`
   - `contacto.html`     → `app/contacto/page.tsx`
   - `ingresar.html`     → `app/ingresar/page.tsx`
   - El routing manual de Express (`server.js` líneas 41-54) **desaparece**: Next enruta
     por la estructura de carpetas.

4. **JS → componentes React**
   - `public/js/menu.js` → componente `<Navbar/>` con `useState` para el menú móvil.

5. **Datos mock → capa de datos**
   - Primero: mover los mocks de `server.js` a `lib/data.ts` (tipado).
   - Luego: migrar a **Supabase** cuando esté listo (habilita login real en `/ingresar`).

6. **API → Route Handlers**
   - `/api/properties` → `app/api/properties/route.ts`
   - `/api/agencies`   → `app/api/agencies/route.ts`
   - Alternativa: leer datos directo en **Server Components** (sin API ni `fetch`).

---

## 4. Estructura objetivo (referencia)

```
web/
├── app/
│   ├── page.tsx                # index
│   ├── propiedades/page.tsx
│   ├── agencias/page.tsx
│   ├── nosotros/page.tsx
│   ├── contacto/page.tsx
│   ├── ingresar/page.tsx
│   ├── api/
│   │   ├── properties/route.ts
│   │   └── agencies/route.ts
│   └── globals.css
├── components/
│   └── Navbar.tsx
├── lib/
│   └── data.ts                 # mocks tipados → luego Supabase
├── package.json
└── ...
```

---

## 5. Checklist de migración

- [ ] Proyecto Next.js creado con pnpm (TS + Tailwind + App Router)
- [ ] `base.css` migrado a Tailwind theme / `globals.css`
- [ ] `<Navbar/>` funcionando (menú móvil con `useState`)
- [ ] Vista `index` migrada (prueba del patrón)
- [ ] Resto de vistas migradas
- [ ] Mocks movidos a `lib/data.ts` tipados
- [ ] Route Handlers o Server Components leyendo datos
- [ ] Integración Supabase (datos reales + auth)
- [ ] Deploy (Vercel o VPS con PM2)
- [ ] Retirar el stack legacy de `inmobiliaria/`

---

## 6. Gestor de paquetes: pnpm (decisión de seguridad)

Se usa **pnpm**, no npm. Motivos:

- **Seguridad supply-chain:** ante ataques recientes de paquetes comprometidos en npm,
  pnpm permite un *cooldown* con `minimumReleaseAge` para **no instalar versiones recién
  publicadas** (ej. esperar 7 días a que la comunidad detecte paquetes maliciosos).
- **Velocidad y espacio:** `node_modules` por enlaces duros desde un store global.
- **Coherencia:** el proyecto ya usa `pnpm-lock.yaml`.

Config recomendada en `.npmrc` (cooldown anti supply-chain):

```ini
# Espera 7 días (10080 min) antes de aceptar una versión recién publicada
minimum-release-age=10080
```

Comandos base:

```bash
pnpm install          # instalar dependencias
pnpm dev              # desarrollo (Next)
pnpm build            # build de producción
pnpm start            # servir build
```

---

## 7. Comandos del stack legacy (referencia, mientras coexiste)

```bash
cd inmobiliaria
pnpm install
PORT=3005 pnpm start  # node server.js  → http://localhost:3005  (el 3000 lo usa Easypanel)
```
