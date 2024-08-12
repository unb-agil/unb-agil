import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '@/entity/User';

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
  entities: [User],
  migrations: [],
  subscribers: [],
});
