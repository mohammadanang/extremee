import UserDao from '../entities/user.dao';
import { CRUD } from '../../../common/interfaces/common.interface';
import { CreateUserDto, PutUserDto, PatchUserDto } from '../entities/user.dto';

class UserService implements CRUD {
  async create(resource: CreateUserDto) {
    return UserDao.addUser(resource);
  }

  async delete(id: string): Promise<any> {
    return UserDao.removeUserById(id);
  }

  async list(limit: number, page: number) {
    return UserDao.getUsers(limit, page);
  }

  async patch(id: string, resource: PatchUserDto): Promise<any> {
    return UserDao.updateUserById(id, resource);
  }

  async show(id: string) {
    return UserDao.getUserById(id);
  }

  async put(id: string, resource: PutUserDto): Promise<any> {
    return UserDao.updateUserById(id, resource);
  }

  async getByEmail(email: string) {
    return UserDao.getUserByEmail(email);
  }

  async getByEmailWithPassword(email: string) {
    return UserDao.getUserByEmailWithPassword(email);
  }
}

export default new UserService();
