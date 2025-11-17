# Configuración de BasePath para Webflow Cloud

## Problemas Resueltos

### 1. Errores 404 en APIs
El proyecto está desplegado en Webflow Cloud montado en el subpath `/app`, lo que causaba errores 404 en las llamadas a la API porque las rutas relativas como `/api/jobs` intentaban acceder a `https://tu-sitio.webflow.io/api/jobs` en lugar de `https://tu-sitio.webflow.io/app/api/jobs`.

### 2. Errores 500 en APIs
Las APIs estaban fallando con errores 500 porque Prisma requiere Node.js runtime, no Edge runtime de Cloudflare.

## Soluciones Implementadas

### 1. Función Helper: `apiUrl()`

Se creó un helper en `src/lib/apiUrl.js` que automáticamente agrega el basePath correcto a todas las rutas de API:

### 2. Runtime de Node.js en APIs

Todas las rutas de API que usan Prisma ahora especifican `runtime = 'nodejs'` porque Prisma no es compatible con Edge runtime:

```javascript
// Uso en componentes cliente
import { apiUrl } from '@/lib/apiUrl';

// Antes
fetch('/api/jobs');  // ❌ 404 en producción

// Ahora
fetch(apiUrl('/api/jobs'));  // ✅ Funciona en todos los ambientes
```

```javascript
// Uso en rutas de API
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Especificar Node.js runtime para Prisma
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  // Tu código aquí
}
```

### 3. Archivos Actualizados

**Componentes cliente con apiUrl():**

- ✅ `src/app/jobs/JobsClient.js`
- ✅ `src/components/FeaturedJobs.js`
- ✅ `src/components/SearchBar.js`
- ✅ `src/components/PopularCategories.js`
- ✅ `src/app/post-job/page.js`
- ✅ `src/app/post-ad/page.js`
- ✅ `src/app/admin/page.js`

**Rutas de API con Node.js runtime:**
- ✅ `src/app/api/jobs/route.js`
- ✅ `src/app/api/jobs/[id]/route.js`
- ✅ `src/app/api/jobs/featured/route.js`
- ✅ `src/app/api/jobs/submit/route.js`
- ✅ `src/app/api/categories/route.js`
- ✅ `src/app/api/search/route.js`
- ✅ `src/app/api/stats/route.js`
- ✅ `src/app/api/auth/login/route.js`
- ✅ `src/app/api/auth/me/route.js`

### 4. Configuración de Prisma

Actualizado `prisma/schema.prisma` para incluir binarios compatibles con Cloudflare:

```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}
```

### 5. Configuración en next.config.mjs

```javascript
const nextConfig = {
  basePath: '/app',
  assetPrefix: '/app',
  // ... resto de la configuración
};
```

## Cómo Funciona

1. **En Producción (Webflow Cloud)**: 
   - La app está montada en `/app`
   - `apiUrl('/api/jobs')` retorna `/app/api/jobs`
   - Las rutas se resuelven correctamente

2. **En Desarrollo Local**: 
   - La app está en la raíz `/`
   - El `basePath` sigue siendo `/app` para mantener consistencia
   - Accedes a la app en `http://localhost:3000/app`

## Testing Local

Para probar localmente con el basePath:

```bash
npm run dev
```

Luego navega a: `http://localhost:3000/app`

### Importante sobre Links
- Los componentes `<Link>` de Next.js automáticamente manejan el basePath
- Solo las llamadas `fetch()` necesitan usar `apiUrl()`
- Usa `<Link href="/jobs">` sin el `/app` prefix (Next.js lo agrega automáticamente)

## Verificación en Producción

Después de desplegar, verifica:

1. **Página principal**: `https://tu-sitio.webflow.io/app`
2. **API de prueba**: `https://tu-sitio.webflow.io/app/api/test-env`
3. **Jobs API**: `https://tu-sitio.webflow.io/app/api/jobs?page=1&limit=10`

## Errores Comunes Resueltos

- ❌ `404 Not Found` en rutas de API → ✅ Solucionado con `apiUrl()`
- ❌ Assets no cargan → ✅ Configurado con `assetPrefix: '/app'`
- ❌ Links rotos → ✅ Next.js maneja automáticamente el basePath en `<Link>`

## Variables de Entorno

Las variables de entorno están configuradas en Webflow Cloud y disponibles en runtime:
- `DATABASE_URL` - PostgreSQL en Railway
- `WEBFLOW_SITE_ID` - ID del sitio
- `WEBFLOW_SITE_API_TOKEN` - Token de API

Ver `docs/WEBFLOW_ENV_SETUP.md` para más detalles.
