# Configuración para Webflow Cloud con Prisma

## El Problema

Webflow Cloud usa **Cloudflare Workers con Edge Runtime**, y el Prisma Client estándar NO es compatible directamente con Edge Runtime. Esto causaba errores 500 en todas las rutas de API que intentaban acceder a la base de datos.

## La Solución

### ⚠️ IMPORTANTE: NO usar `runtime = 'nodejs'`

**La documentación oficial de Webflow Cloud NO menciona `runtime = 'nodejs'`**. En cambio, debemos usar:

1. **Prisma con Driver Adapters** (pg adapter para PostgreSQL)
2. **Cloudflare's `nodejs_compat` flag** en wrangler.jsonc
3. **Edge-compatible packages** solamente

### 1. Usar Prisma con PostgreSQL Driver Adapter

En lugar de especificar Node.js runtime, usamos el adapter de PostgreSQL que es compatible con Edge:

```javascript
// src/lib/prisma.js
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

function getPrismaClient() {
  // En desarrollo, usar Prisma estándar
  if (process.env.NODE_ENV === 'development' || !process.env.DATABASE_URL) {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  // En producción con Webflow Cloud/Edge Runtime, usar pg adapter
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({ adapter, log: ['error'] });
}

export const prisma = getPrismaClient();
```

```javascript
// src/app/api/jobs/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ✅ CORRECTO: Solo force-dynamic, NO runtime = 'nodejs'
export const dynamic = 'force-dynamic';

export async function GET(request) {
  // Tu código aquí con Prisma
}
```

### 2. Instalar Dependencias Necesarias

```bash
npm install @prisma/adapter-pg pg
```

### 3. Configurar wrangler.jsonc con nodejs_compat

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "nextjs",
  "main": ".open-next/worker.js",
  "compatibility_date": "2025-03-01",
  "compatibility_flags": [
    "nodejs_compat"  // ⚠️ CRÍTICO para Prisma y bcrypt
  ],
  "assets": {
    "binding": "ASSETS",
    "directory": ".open-next/assets"
  }
}
```

### 4. Configurar Binarios de Prisma

El `schema.prisma` necesita incluir los binarios correctos:

```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}
```

### 5. Variables de Entorno en Runtime

Webflow Cloud inyecta las variables de entorno solo en **runtime**, no durante el build.

Para desarrollo local con Wrangler, crea un archivo `.dev.vars`:

```env
DATABASE_URL="postgresql://..."
WEBFLOW_SITE_ID="..."
WEBFLOW_SITE_API_TOKEN="..."
JWT_SECRET="..."
```

**⚠️ Agrega `.dev.vars` a .gitignore**

## Archivos Configurados

### APIs con `dynamic = 'force-dynamic'`

Todos estos archivos ahora tienen **SOLO** `export const dynamic = 'force-dynamic'` (NO `runtime = 'nodejs'`):

1. **Jobs APIs:**
   - `src/app/api/jobs/route.js` - Listado de trabajos
   - `src/app/api/jobs/[id]/route.js` - Detalle de trabajo
   - `src/app/api/jobs/featured/route.js` - Trabajos destacados
   - `src/app/api/jobs/submit/route.js` - Envío de trabajos

2. **Categories API:**
   - `src/app/api/categories/route.js` - Categorías

3. **Search API:**
   - `src/app/api/search/route.js` - Búsqueda

4. **Stats API:**
   - `src/app/api/stats/route.js` - Estadísticas

5. **Auth APIs:**
   - `src/app/api/auth/login/route.js` - Login
   - `src/app/api/auth/me/route.js` - Usuario actual

## Con `nodejs_compat` en Cloudflare Workers

El flag `nodejs_compat` en `wrangler.jsonc` habilita un subset de APIs de Node.js en Edge Runtime:

**✅ Disponible con `nodejs_compat`:**
- ✅ Prisma con pg adapter
- ✅ bcrypt/bcryptjs
- ✅ jsonwebtoken
- ✅ Buffer, crypto (Node.js APIs básicas)
- ✅ pg (PostgreSQL driver)
- ✅ fetch API

**❌ NO disponible (incluso con `nodejs_compat`):**
- ❌ File system APIs (fs, path)
- ❌ Prisma Client sin adapter
- ❌ Algunos módulos nativos de Node.js
- ❌ Child processes

## Ventajas de usar Prisma con Driver Adapters

1. **Compatible con Edge**: Funciona en Cloudflare Workers
2. **Rendimiento**: Conexiones optimizadas para edge
3. **Escalabilidad**: Connection pooling manejado por el adapter
4. **Misma API de Prisma**: No necesitas cambiar tu código de queries

## Verificación

Después de desplegar, verifica que las APIs funcionen:

```bash
# Debe retornar 200 OK con datos
curl https://tu-sitio.webflow.io/app/api/jobs?page=1&limit=10

# Debe retornar 200 OK con categorías
curl https://tu-sitio.webflow.io/app/api/categories
```

## Troubleshooting

### Error 500: "PrismaClient is unable to run in this browser environment"
**Causa:** Prisma sin adapter en Edge runtime  
**Solución:** ✅ Ya implementado - usamos `@prisma/adapter-pg`

### Error: "Cannot find module '@prisma/adapter-pg'"
**Causa:** Adapter no instalado  
**Solución:** `npm install @prisma/adapter-pg pg`

### Error: "Cannot find module '@prisma/client'"
**Causa:** Cliente de Prisma no generado  
**Solución:** `npx prisma generate`

### Error: "Can't reach database server"
**Causa:** `DATABASE_URL` no disponible o incorrecta  
**Solución:** 
1. Verificar en Webflow Cloud Settings > Environment Variables
2. Para local: Verificar `.dev.vars`

### Error: "nodejs_compat is not enabled"
**Causa:** Flag faltante en wrangler.jsonc  
**Solución:** ✅ Ya configurado en wrangler.jsonc

### Error 500 en todas las APIs después del deploy
**Causa:** Posibles causas:
1. DATABASE_URL no configurada en Webflow Cloud
2. Binarios de Prisma incompatibles
3. nodejs_compat no habilitado en producción

**Solución:**
1. Verificar variables de entorno en Webflow Cloud
2. ✅ Binarios ya configurados con `binaryTargets`
3. El flag `nodejs_compat` debe estar en producción (verificar con Webflow support si es necesario)

## Referencias

- [Next.js Edge Runtime](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)
- [Prisma Edge Compatibility](https://www.prisma.io/docs/orm/prisma-client/deployment/edge/overview)
- [Webflow Cloud Documentation](https://developers.webflow.com/docs/cloud)
