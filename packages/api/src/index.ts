import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import departmentRoutes from '@/routes/departmentRoutes';

const app = express();
app.use(express.json());

createConnection()
  .then(async () => {
    app.use('/departments', departmentRoutes);

    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => console.log(error));
