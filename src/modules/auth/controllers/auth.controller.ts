import { Request, Response } from 'express';
import debug from 'debug';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Result } from '../../../common/interfaces/common.interface';

const log: debug.IDebugger = debug('app:auth-controller');
const JWT_SECRET: any = process.env.JWT_SECRET;
const tokenExpirationInSeconds: number = 36000;

class AuthController {
  async createJWT(req: Request, res: Response) {
    try {
      const refreshId = req.body.userId + JWT_SECRET;
      const salt = crypto.createSecretKey(crypto.randomBytes(16));
      const hash = crypto
        .createHmac('sha512', salt)
        .update(refreshId)
        .digest('base64');
      req.body.refreshKey = salt.export();
      const token = jwt.sign(req.body, JWT_SECRET, {
        expiresIn: tokenExpirationInSeconds,
      });
      const result: Result = {
        code: 201,
        status: 'success',
        message: 'generate jwt token successfully',
        data: {
          accessToken: token,
          refreshToken: hash,
        }
      };
      return res.status(201).send(result);
    } catch(err) {
      log('generate jwt error: %O', err);
      return res.status(500).send();
    }
  }
}

export default new AuthController();
