import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config({ path: `.local.env` });

export const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/**/*.entity.{ts,js}'],
  synchronize: false,
  migrationsTableName: 'migration',
  migrations: [`dist/database/${process.env.MIGRATION_TYPE}/*{.ts,.js}`],
  logging: true,
});
