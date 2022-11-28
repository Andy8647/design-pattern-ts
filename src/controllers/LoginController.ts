import { Request, Response } from 'express';
import { controller, get, post, bodyValidator } from './decorators';

@controller('/auth')
class LoginController {
  @get('/login')
  getLogin(req: Request, res: Response): void {
    res.send(`
    <form method='post'>
      <div>
        <label>Email</label>
        <input name='email'/>
      </div>
      <div>
        <label>Password</label>
        <input name='password' type='password'/>
      </div>
      <button>Submit</button>
    </form>
  `);
  }

  @post('/login')
  @bodyValidator('email', 'password')
  postLogin(req: Request, res: Response): void {
    const { email, password } = req.body;
    if (email === 'test@test.com' && password === '123456') {
      // mark this person as logged in, function powered by cookie-session
      req.session = { loggedIn: true };
      res.redirect('/');
    } else {
      res.send('Invalid email or password');
    }
  }

  @get('/logout')
  getLogout(req: Request, res: Response): void {
    req.session = undefined;
    res.redirect('/');
  }
}
