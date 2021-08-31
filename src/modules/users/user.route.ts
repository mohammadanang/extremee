import { CommonRoutes } from '../../common/common.route';
import { Application } from 'express';
import userController from './controllers/user.controller';
import userMiddleware from './middleware/user.middleware';
import jwtMiddleware from '../auth/middleware/jwt.middleware';
import commonPermissionMiddleware from '../../common/middleware/common-permission.middleware';
import { PermissionFlag } from '../../common/types/permission.type';
import bodyValidationMiddleware from '../../common/middleware/body-validation.middleware';
import { body } from 'express-validator';

export class UserRoutes extends CommonRoutes {
  constructor(app: Application) {
    super(app, 'UserRoutes');
  }

  configureRoutes(): Application {
    this.app.route('/user')
      .get(
        jwtMiddleware.validJWTNeeded,
        commonPermissionMiddleware.permissionFlagRequired(
          PermissionFlag.ADMIN_PERMISSION
        ),
        userController.listUser
      )
      .post(
        body('email').isEmail,
        body('password').isLength({ min: 5 }).withMessage('Must include password (5+ characters)'),
        bodyValidationMiddleware.verifyBodyFieldsErrors,
        userMiddleware.validateSameEmailDoesntExist,
        userController.createUser
      );
    this.app.param('userId', userMiddleware.extractUserId);
    this.app.route('/user/:userId')
      .all(
        userMiddleware.validateUserExists,
        jwtMiddleware.validJWTNeeded,
        commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction
      )
      .get(userController.detailUser)
      .delete(userController.deleteUser);
    this.app.put('/user/:userId', [
      body('email').isEmail(),
      body('password').isLength({ min: 5 }).withMessage('Must include password (5+ characters)'),
      body('firstName').isString(),
      body('lastName').isString(),
      body('permissionFlags').isInt(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      userMiddleware.validateSameEmailBelongToSameUser,
      userMiddleware.userCantChangePermission,
      commonPermissionMiddleware.permissionFlagRequired(
        PermissionFlag.PAID_PERMISSION
      ),
      userController.putUser,
    ]);
    this.app.patch('/user/:userId', [
      body('email').isEmail().optional(),
      body('password')
        .isLength({ min: 5 })
        .withMessage('Password must be 5+ characters')
        .optional(),
      body('firstName').isString().optional(),
      body('lastName').isString().optional(),
      body('permissionFlags').isInt().optional(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      userMiddleware.validatePatchEmail,
      userMiddleware.userCantChangePermission,
      commonPermissionMiddleware.permissionFlagRequired(
        PermissionFlag.PAID_PERMISSION
      ),
      userController.patchUser,
    ]);
    this.app.put('/user/:userId/permissionFlags/:permissionFlags', [
      jwtMiddleware.validJWTNeeded,
      commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
      commonPermissionMiddleware.permissionFlagRequired(
        PermissionFlag.FREE_PERMISSION
      ),
      userController.updatePermissionFLags
    ]);

    return this.app;
  }
}
