import 'reflect-metadata';
import { DataSource } from 'typeorm';

import Department from '@/entity/Department';
import Program from '@/entity/Program';
import Curriculum from '@/entity/Curriculum';
import CurriculumComponent from '@/entity/CurriculumComponent';
import Component from '@/entity/Component';

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
  entities: [Department, Program, Curriculum, CurriculumComponent, Component],
  migrations: [],
  subscribers: [],
});
