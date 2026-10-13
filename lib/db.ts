import { Pool, PoolConfig } from 'pg';
import { parseDatabaseUrl } from './helpers';

let pool: any;

const DB_CONFIG = {
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

class PgPoolWrapper {
  private pgPool: Pool;

  constructor(config: PoolConfig) {
    this.pgPool = new Pool(config);
  }

  async query(sql: string, params?: any[]) {
    // Clean SQL: PostgreSQL doesn't support MySQL backticks.
    let cleanedSql = sql.replace(/`/g, '');

    // Translate placeholders from ? to $1, $2, ...
    let count = 1;
    let convertedSql = cleanedSql.replace(/\?/g, () => `$${count++}`);
    
    // Support INSERT IGNORE INTO -> ON CONFLICT DO NOTHING
    if (convertedSql.toUpperCase().includes('INSERT IGNORE INTO')) {
      convertedSql = convertedSql.replace(/INSERT IGNORE INTO/gi, 'INSERT INTO');
      if (!convertedSql.toUpperCase().includes('ON CONFLICT')) {
        // If it is skills insert, we have a unique constraint on name.
        if (convertedSql.toLowerCase().includes('into skills')) {
          convertedSql += ' ON CONFLICT (name) DO NOTHING';
        } else {
          convertedSql += ' ON CONFLICT DO NOTHING';
        }
      }
    }

    const isInsert = convertedSql.trim().toUpperCase().startsWith('INSERT');
    if (isInsert && !convertedSql.toUpperCase().includes('RETURNING')) {
      convertedSql = convertedSql.trim().replace(/;?$/, '') + ' RETURNING id';
    }

    try {
      const result = await this.pgPool.query(convertedSql, params);
      
      if (isInsert) {
        // mysql2 returns { insertId: ... }
        const insertId = result.rows[0]?.id || null;
        const mockResult = {
          insertId,
          affectedRows: result.rowCount || 0,
          warningStatus: 0
        };
        return [mockResult, null];
      } else {
        // mysql2 returns [rows, fields]
        return [result.rows, null];
      }
    } catch (err: any) {
      console.error('--- SQL EXECUTION ERROR ---');
      console.error('Original SQL:', sql);
      console.error('Converted SQL:', convertedSql);
      console.error('Params:', params);
      console.error('Error:', err.message);
      throw err;
    }
  }

  async end() {
    return this.pgPool.end();
  }
}

if (!(global as any).pool) {
  const host = DB_CONFIG.host || 'localhost';
  const useSsl = host !== 'localhost' && host !== '127.0.0.1' && host !== 'mariadb' && host !== 'mariadb_prod' && !host.startsWith('172.');
  
  const parsedOptions = parseDatabaseUrl(DB_CONFIG.url || '');
  const connectionOptions = parsedOptions ? {
    host: parsedOptions.host,
    port: parsedOptions.port,
    user: parsedOptions.user,
    password: parsedOptions.password,
    database: parsedOptions.database,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  } : {
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
    database: DB_CONFIG.database,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  };

  (global as any).pool = new PgPoolWrapper({
    ...connectionOptions,
    max: 5, // Aumentado para Postgres
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
  
  console.log('🔌 [DB]: Pool de conexiones PostgreSQL inicializado (Modo de Compatibilidad)');
}

pool = (global as any).pool;

export default pool;
