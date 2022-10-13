import 'reflect-metadata';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'lireddit2',
  entities: ['dist/entities/*.js'],
  migrations: ['src/migration/**/*.ts'],
});

export default AppDataSource;
