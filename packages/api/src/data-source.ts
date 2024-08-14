import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Department } from '@/entity/Department';

export const AppDataSource = new DataSource({
  type: 'mysql',
  driver: {}, // This force to use mysql2
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: true,
  logging: false,
  entities: [Department],
  migrations: [],
  subscribers: [],
});
