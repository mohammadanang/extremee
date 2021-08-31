import UserDao from '../entities/user.dao';
import { CRUD } from '../../../config/common.interface';
import { CreateUserDto, PutUserDto, PatchUserDto } from '../entities/user.dto';

class UserService implements CRUD {
  async create(resource: CreateUserDto) {
    return UserDao.addUser(resource);
  }

  async delete(id: string) {
    return UserDao.removeUserById(id);
  }

  async list(limit: number, page: number) {
    return UserDao.getUsers();
  }

  async patch(id: string, resource: PatchUserDto) {
    return UserDao.patchUserById(id, resource);
  }

  async show(id: string) {
    return UserDao.getUserById(id);
  }

  async put(id: string, resource: PutUserDto) {
    return UserDao.putUserById(id, resource);
  }

  async getByEmail(email: string) {
    return UserDao.getUserByEmail(email);
  }
}

export default new UserService();
