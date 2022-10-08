import 'reflect-metadata';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'emmanuel2001',
  database: 'lireddit3',
  entities: ['dist/entities/*.js'],
  migrations: ['src/migration/**/*.ts'],
});

export default AppDataSource;
