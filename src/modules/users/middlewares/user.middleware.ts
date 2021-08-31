import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import debug from 'debug';
import { Result } from '../../../config/common.interface';

const log: debug.IDebugger = debug('app:user-middleware');

class UserMiddleware {
  async validateRequiredBodyFields(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if(req.body && req.body.email && req.body.password) {
      next();
    } else {
      const result: Result = {
        code: 400,
        status: 'error',
        message: 'Missing required fields email and password'
      };
      res.status(400).send(result);
    }
  }

  async validateSameEmailDoesntExist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = await userService.getByEmail(req.body.email);
    if(user) {
      const result: Result = {
        code: 400,
        status: 'error',
        message: 'User email already exists'
      };
      res.status(400).send(result);
    } else {
      next();
    }
  }

  async validateSameEmailBelongToSameUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = await userService.getByEmail(req.body.email);
    if(user && user.id === req.params.userId) {
      next();
    } else {
      const result: Result = {
        code: 400,
        status: 'error',
        message: 'Invalid email'
      };
      res.status(400).send(result);
    }
  }

  validatePatchEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if(req.body.email) {
      log('Validating email', req.body.email);

      this.validateSameEmailBelongToSameUser(req, res, next);
    } else {
      next();
    }
  };

  async validateUserExists(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = await userService.show(req.params.userId);
    if(user) {
      next();
    } else {
      const result: Result = {
        code: 400,
        status: 'error',
        message: `User ${req.params.userId} not found`
      };
      res.status(400).send(result);
    }
  }

  async extractUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    req.body.id = req.params.userId;
    next();
  }
}

export default new UserMiddleware();
