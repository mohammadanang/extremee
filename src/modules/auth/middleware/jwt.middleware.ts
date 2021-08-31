import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Jwt } from '../../../common/types/jwt.type';
import userService from '../../users/services/user.service';
import { Result } from '../../../common/interfaces/common.interface';

const JWT_SECRET: any = process.env.JWT_SECRET;

class JwtMiddleware {
  verifyRefreshBodyField(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if(req.body && req.body.refreshToken) {
      return next();
    } else {
      const result: Result = {
        code: 400,
        status: 'error',
        message: 'Missing required field: refreshToken',
      };
      return res.status(400).send(result);
    }
  }

  async validRefreshNeeded(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user: any = await userService.getByEmailWithPassword(
      res.locals.jwt.email
    );
    const salt = crypto.createSecretKey(
      Buffer.from(res.locals.jwt.refreshKey.data)
    );
    const hash = crypto
      .createHmac('sha512', salt)
      .update(res.locals.jwt.userId + JWT_SECRET)
      .digest('base64');

    if(hash === req.body.refreshToken) {
      req.body = {
        userId: user._id,
        email: user.email,
        permissionFlags: user.permissionFlags,
      };
      return next();
    } else {
      const result: Result = {
        code: 400,
        status: 'error',
        message: 'Invalid refresh token',
      };
      return res.status(400).send(result);
    }
  }

  validJWTNeeded(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if(req.headers['authorization']) {
      try {
        const authorization = req.headers['authorization'].split(' ');
        if(authorization[0] !== 'Bearer') {
          return res.status(401).send();
        } else {
          res.locals.jwt = jwt.verify(
            authorization[1],
            JWT_SECRET
          ) as Jwt;
          next();
        }
      } catch(err) {
        return res.status(403).send();
      }
    } else {
      return res.status(401).send();
    }
  }
}

export default new JwtMiddleware();
