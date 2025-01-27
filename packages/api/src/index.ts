import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

import { AppDataSource } from '#data-source.js';
import { Routes } from '#routes.js';

const upload = multer({ dest: 'uploads/' });

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    Routes.forEach((route) => {
      const middlewares = [];

      if (route.upload) {
        middlewares.push(upload.single(route.upload));
      }

      app[route.method](
        route.route,
        ...middlewares,
        (req: Request, res: Response, next: NextFunction) => {
          const result = new route.controller()[route.action](req, res, next);
          if (result instanceof Promise) {
            result.then((result) =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined,
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        },
      );
    });

    app.listen(process.env.API_PORT);
    console.log(`Server started at http://localhost:${process.env.API_PORT}`);
  })
  .catch((error) => console.log(error));
