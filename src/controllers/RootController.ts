import { NextFunction, Request, Response } from 'express';
import { controller, get, use } from './decorators';

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session && req.session.loggedIn) {
    next();
    return;
  } else {
    res.status(403);
    res.send('Denied');
  }
}

@controller('')
class RootController {
  @get('/')
  getRoot(req: Request, res: Response): void {
    if (req.session && req.session.loggedIn) {
      res.send(`
      <div>
        <div>your are logged in</div>
        <a href='/auth/logout'>Logout</a>
      </div>
    `);
    } else {
      res.send(`
      <div>
        <div>your are not logged in</div>
        <a href='/auth/login'>Login</a>
      </div>
    `);
    }
  }

  @get('/protected')
  @use(requireAuth)
  getProtected(req: Request, res: Response): void {
    res.send('Welcome to protected route');
  }
}
