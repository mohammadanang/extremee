import { CommonRoutes } from '../../config/common.route';
import { Application } from 'express';
import userController from './controllers/user.controller';
import userMiddleware from './middlewares/user.middleware';

export class UserRoutes extends CommonRoutes {
  constructor(app: Application) {
    super(app, 'UserRoutes');
  }

  configureRoutes() {
    this.app.route('/user')
      .get(userController.listUser)
      .post(
        userMiddleware.validateRequiredBodyFields,
        userMiddleware.validateSameEmailDoesntExist,
        userController.createUser
      );
    this.app.param('userId', userMiddleware.extractUserId);
    this.app.route('/user/:userId')
      .all(userMiddleware.validateUserExists)
      .get(userController.detailUser)
      .delete(userController.deleteUser);
    this.app.put('/user/:userId', [
      userMiddleware.validateRequiredBodyFields,
      userMiddleware.validateSameEmailBelongToSameUser,
      userController.putUser,
    ]);
    this.app.patch('/user/:userId', [
      userMiddleware.validatePatchEmail,
      userController.patchUser,
    ]);

    return this.app;
  }
}
