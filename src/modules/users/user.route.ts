import { CommonRoutes } from '../../config/common.route';
import { Application, Request, Response, NextFunction } from 'express';

export class UserRoutes extends CommonRoutes {
  constructor(app: Application) {
    super(app, 'UserRoutes');
  }

  configureRoutes() {
    this.app.route('/user')
      .get((req: Request, res: Response) => {
        res.status(200).send('List of users');
      })
      .post((req: Request, res: Response) => {
        res.status(200).send('Post to user');
      });

    this.app.route('/user/:userId')
      .all((req: Request, res: Response, next: NextFunction) => {
        // this is for middleware
        next();
      })
      .get((req: Request, res: Response) => {
        res.status(200).send(`Get requested for id ${req.params.userId}`);
      })
      .put((req: Request, res: Response) => {
        res.status(200).send(`Put requested for id ${req.params.userId}`);
      })
      .patch((req: Request, res: Response) => {
        res.status(200).send(`Patch requested for id ${req.params.userId}`);
      })
      .delete((req: Request, res: Response) => {
        res.status(200).send(`Delete requested for id ${req.params.userId}`);
      });

    return this.app;
  }
}
