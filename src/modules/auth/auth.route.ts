import { CommonRoutes } from '../../common/common.route';
import authController from './controllers/auth.controller';
import jwtMiddleware from './middleware/jwt.middleware';
import authMiddleware from './middleware/auth.middleware';
import { Application } from 'express';
import bodyValidationMiddleware from '../../common/middleware/body-validation.middleware';
import { body } from 'express-validator';

export class AuthRoutes extends CommonRoutes {
  constructor(app: Application) {
    super(app, 'AuthRoute');
  }

  configureRoutes(): Application {
    this.app.post('/auth', [
      body('email').isEmail(),
      body('password').isString(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      authMiddleware.verifyUserPassword,
      authController.createJWT,
    ]);
    this.app.post('/auth/refresh-token', [
      jwtMiddleware.validJWTNeeded,
      jwtMiddleware.verifyRefreshBodyField,
      jwtMiddleware.validRefreshNeeded,
      authController.createJWT,
    ]);

    return this.app;
  }
}