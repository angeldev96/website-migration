# Configuración de Variables de Entorno para Webflow Cloud

## Variables Requeridas

Debes configurar las siguientes variables de entorno en Webflow Cloud:

### 1. DATABASE_URL
- **Nombre**: `DATABASE_URL`
- **Valor**: `postgresql://user:password@host:port/database`
- **Secret**: ✅ Sí (marcar como "Secret")
- **Descripción**: URL de conexión a PostgreSQL en Railway

### 2. WEBFLOW_SITE_ID
- **Nombre**: `WEBFLOW_SITE_ID`
- **Valor**: `tu-webflow-site-id`
- **Secret**: ❌ No
- **Descripción**: ID del sitio de Webflow

### 3. WEBFLOW_SITE_API_TOKEN
- **Nombre**: `WEBFLOW_SITE_API_TOKEN`
- **Valor**: `tu-webflow-api-token`
- **Secret**: ✅ Sí (marcar como "Secret")
- **Descripción**: Token de API de Webflow

## Pasos para Configurar en Webflow Cloud

1. Ve a tu proyecto en el dashboard de Webflow Cloud
2. Selecciona el environment que deseas configurar (ej: Production)
3. Haz clic en la pestaña "Environment Variables"
4. Para cada variable:
   - Haz clic en "Add Variable"
   - Ingresa el "Variable Name" exactamente como se muestra arriba
   - Ingresa el "Variable Value"
   - Activa "Secret" para DATABASE_URL y WEBFLOW_SITE_API_TOKEN
   - Haz clic en "Add Variable" para guardar
5. Repite para todas las variables

## Importante ⚠️

- Las variables de entorno en Webflow Cloud **solo están disponibles en runtime**, NO durante el build
- El archivo `.env` local es solo para desarrollo
- NO subas el archivo `.env` a git (ya está en .gitignore)
- Las variables se acceden con `process.env.VARIABLE_NAME`

## Acceso en el Código

```javascript
// Ejemplo de uso
const databaseUrl = process.env.DATABASE_URL;
const siteId = process.env.WEBFLOW_SITE_ID;
const apiToken = process.env.WEBFLOW_SITE_API_TOKEN;
```

## Verificación

Después de configurar las variables, puedes verificar que estén disponibles creando un endpoint de prueba:

```javascript
// src/app/api/test-env/route.js
export async function GET() {
  return Response.json({
    hasDatabase: !!process.env.DATABASE_URL,
    hasSiteId: !!process.env.WEBFLOW_SITE_ID,
    hasApiToken: !!process.env.WEBFLOW_SITE_API_TOKEN,
  });
}
```
