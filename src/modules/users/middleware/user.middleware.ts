import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import debug from 'debug';
import { Result } from '../../../common/interfaces/common.interface';

const log: debug.IDebugger = debug('app:user-middleware');

class UserMiddleware {
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
    if(res.locals.user._id === req.params.userId) {
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

  async userCantChangePermission(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if(
      'permissionFlags' in req.body &&
      req.body.permissionFlags !== res.locals.user.permissionFlags
    ) {
      const result: Result = {
        code: 400,
        status: 'error',
        message: 'User cannot change permission flags',
      };
      res.status(400).send(result);
    } else {
      next();
    }
  }

  validatePatchEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if(req.body.email) {
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
      res.locals.user = user;
      next();
    } else {
      const result: Result = {
        code: 400,
        status: 'error',
        message: `User ${req.params.userId} not found`,
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
