import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const envConfig = {
  port: parseInt(process.env['PORT'] || '3000', 10),
  nodeEnv: process.env['NODE_ENV'] || 'development',
  corsOrigin: process.env['CORS_ORIGIN'] || 'http://localhost:4200',
  jwt: {
    secret: process.env['JWT_SECRET'] || 'super_secret_enterprise_jwt_key_2026',
    expiresIn: process.env['JWT_EXPIRES_IN'] || '8h'
  },
  db: {
    host: process.env['DB_HOST'] || 'localhost',
    port: parseInt(process.env['DB_PORT'] || '5432', 10),
    user: process.env['DB_USER'] || 'postgres',
    password: process.env['DB_PASSWORD'] || 'admin',
    database: process.env['DB_NAME'] || 'enterprise_erp_db',
    connectionString: process.env['DATABASE_URL'] || undefined
  }
};
