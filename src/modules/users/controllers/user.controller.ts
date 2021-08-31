import { Request, Response } from 'express';
import userService from '../services/user.service';
import argon from 'argon2';
import debug from 'debug';
import { Result } from '../../../common/interfaces/common.interface';
import { PatchUserDto } from '../entities/user.dto';

const log: debug.IDebugger = debug('app:user-controller');

class UserController {
  async listUser(req: Request, res: Response) {
    const users = await userService.list(100, 0);
    const result: Result = {
      code: 200,
      status: 'success',
      message: 'get list user successfully',
      data: users
    };
    res.status(200).send(result);
  }

  async detailUser(req: Request, res: Response) {
    const user = await userService.show(req.body.id);
    const result: Result = {
      code: 200,
      status: 'success',
      message: 'get detail user successfully',
      data: user
    };
    res.status(200).send(result);
  }

  async createUser(req: Request, res: Response) {
    req.body.password = await argon.hash(req.body.password);
    const userId = await userService.create(req.body);
    const result: Result = {
      code: 201,
      status: 'success',
      message: 'post create user successfully',
      data: { id: userId }
    };
    res.status(201).send(result);
  }

  async patchUser(req: Request, res: Response) {
    if(req.body.password) {
      req.body.password = await argon.hash(req.body.password);
    }
    log(await userService.patch(req.body.id, req.body));
    const result: Result = {
      code: 200,
      status: 'success',
      message: 'patch user successfully',
      data: null
    };
    res.status(200).send(result);
  }

  async putUser(req: Request, res: Response) {
    req.body.password = await argon.hash(req.body.password);
    log(await userService.put(req.body.id, req.body));
    const result: Result = {
      code: 200,
      status: 'success',
      message: 'put user successfully',
      data: null
    };
    res.status(200).send(result);
  }

  async deleteUser(req: Request, res: Response) {
    log(await userService.delete(req.body.id));
    const result: Result = {
      code: 200,
      status: 'success',
      message: 'delete user successfully',
      data: null
    };
    res.status(200).send(result);
  }

  async updatePermissionFLags(req: Request, res: Response) {
    const patchUserDto: PatchUserDto = {
      permissionFlags: parseInt(req.params.permissionFlags),
    };
    log(await userService.patch(req.body.id, patchUserDto));
    const result: Result = {
      code: 200,
      status: 'success',
      message: 'update user permission successfully',
      data: null
    };
    res.status(200).send(result);
  }
}

export default new UserController();
