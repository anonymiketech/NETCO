import { getConnection } from '../src/index';

async function healthCheck() {
  try {
    console.log('[v0] Starting database health check...');
    const db = getConnection();
    
    // Test basic query
    const result = await db.execute('SELECT NOW() as timestamp');
    console.log('[v0] ✓ Database connection successful');
    console.log('[v0] Current database time:', result);
    
    // List tables
    const tables = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('[v0] ✓ Tables found:', tables);
    
    process.exit(0);
  } catch (err) {
    console.error('[v0] ✗ Health check failed:', err);
    process.exit(1);
  }
}

healthCheck();
