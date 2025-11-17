# 🚀 Checklist de Despliegue - Webflow Cloud

## ✅ Configuración Completada

### 1. Variables de Entorno
- [ ] `DATABASE_URL` configurada en Webflow Cloud (marcada como Secret)
- [ ] `WEBFLOW_SITE_ID` configurada en Webflow Cloud
- [ ] `WEBFLOW_SITE_API_TOKEN` configurada en Webflow Cloud (marcada como Secret)

### 2. Configuración de BasePath
- [x] `next.config.mjs` tiene `basePath: '/app'` y `assetPrefix: '/app'`
- [x] Helper `src/lib/apiUrl.js` creado
- [x] Todos los componentes actualizados para usar `apiUrl()`

### 3. Archivos Actualizados con apiUrl()
- [x] `src/app/jobs/JobsClient.js`
- [x] `src/components/FeaturedJobs.js`
- [x] `src/components/SearchBar.js`
- [x] `src/components/PopularCategories.js`
- [x] `src/app/post-job/page.js`
- [x] `src/app/post-ad/page.js`
- [x] `src/app/admin/page.js`

### 4. Configuración de Base de Datos
- [x] Prisma Client configurado con fallback para build time
- [x] `DATABASE_URL` disponible en runtime

## 🧪 Tests Después del Despliegue

### Endpoints de Verificación

1. **Health Check**
   ```
   GET https://tu-sitio.webflow.io/app/api/health
   ```
   Debe retornar `success: true`

2. **Environment Variables**
   ```
   GET https://tu-sitio.webflow.io/app/api/test-env
   ```
   Debe retornar `allPresent: true`

3. **Jobs API**
   ```
   GET https://tu-sitio.webflow.io/app/api/jobs?page=1&limit=10
   ```
   Debe retornar lista de trabajos

4. **Categories API**
   ```
   GET https://tu-sitio.webflow.io/app/api/categories
   ```
   Debe retornar lista de categorías

### Páginas a Verificar

- [ ] Página principal: `https://tu-sitio.webflow.io/app`
- [ ] Listado de trabajos: `https://tu-sitio.webflow.io/app/jobs`
- [ ] Detalle de trabajo: `https://tu-sitio.webflow.io/app/jobs/[id]`
- [ ] Post a job: `https://tu-sitio.webflow.io/app/post-job`
- [ ] Admin: `https://tu-sitio.webflow.io/app/admin`

## 🔍 Verificaciones en Browser DevTools

### Console (F12)
- [ ] No hay errores 404 en rutas de API
- [ ] No hay errores de variables de entorno
- [ ] No hay errores de assets (CSS, JS, images)

### Network Tab
- [ ] Todas las llamadas a `/app/api/*` retornan 200 OK
- [ ] Assets se cargan desde `/app/_next/*`
- [ ] No hay redirecciones infinitas

## 🐛 Solución de Problemas Comunes

### Error: 404 en API routes
**Causa:** Las rutas no incluyen el basePath  
**Solución:** Verificar que todos los `fetch()` usen `apiUrl()`

### Error: Environment variables undefined
**Causa:** Variables no configuradas en Webflow Cloud  
**Solución:** Verificar en Settings > Environment Variables

### Error: Cannot connect to database
**Causa:** `DATABASE_URL` incorrecta o no disponible  
**Solución:** Verificar el valor en Webflow Cloud y en Railway

### Error: Assets no cargan (CSS/JS)
**Causa:** `assetPrefix` no configurado  
**Solución:** Ya está configurado en `next.config.mjs`

## 📝 Comandos Útiles

### Probar localmente
```bash
npm run dev
# Navega a: http://localhost:3000/app
```

### Build para producción (testing local)
```bash
npm run build
npm start
# Navega a: http://localhost:3000/app
```

### Verificar tipos TypeScript
```bash
npx tsc --noEmit
```

### Verificar Prisma
```bash
npx prisma validate
npx prisma generate
```

## 📚 Documentación Relacionada

- `docs/WEBFLOW_ENV_SETUP.md` - Configuración de variables de entorno
- `docs/BASEPATH_CONFIGURATION.md` - Explicación del basePath
- `docs/API.md` - Documentación de la API
- `docs/SETUP_COMPLETE.md` - Setup inicial del proyecto

## ✅ Estado Final

Una vez que todos los checkboxes estén marcados y las verificaciones pasen:

**El proyecto está listo para producción en Webflow Cloud** 🎉

### Próximos Pasos
1. Hacer commit de todos los cambios
2. Push a GitHub
3. Desplegar en Webflow Cloud
4. Ejecutar los tests de verificación
5. Monitorear logs en Webflow Cloud dashboard
