export async function GET() {
  try {
    // Test que las rutas de API están funcionando
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    
    return Response.json({
      success: true,
      message: 'API routes are working correctly',
      info: {
        basePath: '',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        hasDatabase: !!process.env.DATABASE_URL,
      },
      endpoints: {
        jobs: `${baseUrl}/api/jobs`,
        categories: `${baseUrl}/api/categories`,
        search: `${baseUrl}/api/search`,
        testEnv: `${baseUrl}/api/test-env`,
      },
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
