import 'reflect-metadata';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: 'lireddit2',
  port: process.env.DB_PORT as any,
  entities: ['dist/entities/*.js'],
  migrations: ['src/migration/**/*.ts'],
});

export default AppDataSource;
