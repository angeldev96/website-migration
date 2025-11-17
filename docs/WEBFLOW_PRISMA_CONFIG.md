# Configuración para Webflow Cloud con Prisma

## El Problema

Webflow Cloud con Cloudflare Workers usa Edge Runtime por defecto, pero **Prisma Client NO es compatible con Edge Runtime**. Esto causaba errores 500 en todas las rutas de API que intentaban acceder a la base de datos.

## La Solución

### 1. Especificar Node.js Runtime en APIs

Todas las rutas de API que usan Prisma deben especificar explícitamente el runtime de Node.js:

```javascript
// src/app/api/jobs/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ⚠️ CRÍTICO: Forzar Node.js runtime para Prisma
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  // Tu código aquí
}
```

### 2. Configurar Binarios de Prisma

El `schema.prisma` necesita incluir los binarios correctos para el entorno de Cloudflare:

```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}
```

### 3. Variables de Entorno en Runtime

Webflow Cloud inyecta las variables de entorno solo en **runtime**, no durante el build. El cliente de Prisma debe manejar esto:

```javascript
// src/lib/prisma.js
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://placeholder',
    },
  },
});
```

## Archivos Configurados

### APIs con Node.js Runtime

Todos estos archivos ahora tienen `export const runtime = 'nodejs'`:

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

## Limitaciones de Edge Runtime

**NO puedes usar en Edge Runtime:**
- ❌ Prisma Client
- ❌ bcrypt/bcryptjs (usada en auth)
- ❌ File system APIs (fs, path)
- ❌ Node.js native modules
- ❌ Algunas librerías de npm que dependen de Node.js APIs

**SÍ puedes usar en Edge Runtime:**
- ✅ fetch API
- ✅ JSON parsing
- ✅ Web APIs estándar
- ✅ Cloudflare Workers APIs

## Por Qué Node.js Runtime

Node.js runtime en Webflow Cloud/Cloudflare ofrece:

1. **Compatibilidad con Prisma**: Acceso completo a la base de datos
2. **npm packages completos**: Soporte para bcrypt, jsonwebtoken, etc.
3. **Variables de entorno**: Acceso a `process.env`
4. **File system**: Si es necesario para logs o archivos temporales

## Trade-offs

### Node.js Runtime
- ✅ Compatible con Prisma y npm packages
- ✅ Más flexible
- ⚠️ Puede ser ligeramente más lento que Edge
- ⚠️ Más uso de memoria

### Edge Runtime
- ✅ Más rápido (edge locations)
- ✅ Menos memoria
- ❌ API limitada
- ❌ No compatible con Prisma

## Verificación

Después de desplegar, verifica que las APIs funcionen:

```bash
# Debe retornar 200 OK con datos
curl https://tu-sitio.webflow.io/app/api/jobs?page=1&limit=10

# Debe retornar 200 OK con categorías
curl https://tu-sitio.webflow.io/app/api/categories
```

## Troubleshooting

### Error: "PrismaClient is unable to run in this browser environment"
**Causa:** API usando Edge runtime  
**Solución:** Agregar `export const runtime = 'nodejs'`

### Error: "Cannot find module '@prisma/client'"
**Causa:** Cliente de Prisma no generado  
**Solución:** Ejecutar `npx prisma generate`

### Error: "Can't reach database server"
**Causa:** `DATABASE_URL` no disponible  
**Solución:** Verificar variables de entorno en Webflow Cloud

### Error: "Binary target not found"
**Causa:** Binario de Prisma no compatible  
**Solución:** Ya configurado con `binaryTargets = ["native", "debian-openssl-3.0.x"]`

## Referencias

- [Next.js Edge Runtime](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)
- [Prisma Edge Compatibility](https://www.prisma.io/docs/orm/prisma-client/deployment/edge/overview)
- [Webflow Cloud Documentation](https://developers.webflow.com/docs/cloud)
