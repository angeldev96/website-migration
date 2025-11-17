export async function GET() {
  // Verifica que las variables de entorno estén disponibles
  const envCheck = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    WEBFLOW_SITE_ID: !!process.env.WEBFLOW_SITE_ID,
    WEBFLOW_SITE_API_TOKEN: !!process.env.WEBFLOW_SITE_API_TOKEN,
    environment: process.env.NODE_ENV || 'unknown',
    timestamp: new Date().toISOString(),
  };

  return Response.json({
    status: 'ok',
    message: 'Environment variables check',
    variables: envCheck,
    allPresent: envCheck.DATABASE_URL && envCheck.WEBFLOW_SITE_ID && envCheck.WEBFLOW_SITE_API_TOKEN,
  });
}
