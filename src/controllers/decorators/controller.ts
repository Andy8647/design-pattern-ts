import 'reflect-metadata';
import { AppRouter } from '../../AppRouter';
import { Methods } from './Methods';
import { MetadataKeys } from './MetadataKeys';
import { RequestHandler, Request, Response, NextFunction } from 'express';

const bodyValidators = (keys: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.body) {
      res.status(422).send('Invalid request');
      return;
    } else {
      for (let key of keys) {
        if (!req.body[key]) {
          res.status(422).send(`Missing property ${key}`);
          return;
        }
      }
      next();
    }
  };
};

export function controller(routePrefix: string) {
  return function (target: Function) {
    const router = AppRouter.getInstance();
    const prototype = target.prototype;

    for (let key in prototype) {
      const routeHandler = prototype[key];
      const path = Reflect.getMetadata(MetadataKeys.path, prototype, key);
      const method: Methods = Reflect.getMetadata(MetadataKeys.method, prototype, key);
      const middleWares = Reflect.getMetadata(MetadataKeys.middleware, prototype, key) || [];
      const requiredBodyProperties =
        Reflect.getMetadata(MetadataKeys.validator, prototype, key) || [];
      const validator = bodyValidators(requiredBodyProperties);

      if (path) {
        router[method](`${routePrefix}${path}`, ...middleWares, validator, routeHandler);
      }
    }
  };
}
