import { Request, Response, NextFunction } from 'express';
import userService from '../../users/services/user.service';
import * as argon from 'argon2';
import { Result } from '../../../common/interfaces/common.interface';

class AuthMiddleware {
  async verifyUserPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user: any = await userService.getByEmailWithPassword(
      req.body.email
    );

    if(user) {
      const passwordHash = user.password;
      if(await argon.verify(passwordHash, req.body.password)) {
        req.body = {
          userId: user._id,
          email: user.email,
          permissionFlags: user.permissionFlags,
        };
        return next();
      }
    }
    const result: Result = {
      code: 400,
      status: 'error',
      message: 'Invalid email and/or password'
    };
    res.status(400).send(result);
  }
}

export default new AuthMiddleware();
