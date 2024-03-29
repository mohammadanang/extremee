import { CreateUserDto, PutUserDto, PatchUserDto } from './user.dto';
import shortid from 'shortid';
import debug from 'debug';
import mongoService from '../../../common/services/mongo.service';
import { PermissionFlag } from '../../../common/types/permission.type';

const log: debug.IDebugger = debug('app:user-dao');

class UserDao {
  Schema = mongoService.getMongoose().Schema;

  userSchema = new this.Schema({
    _id: String,
    email: String,
    password: {
      type: String,
      select: false,
    },
    firstName: String,
    lastName: String,
    permissionFlags: Number,
  }, { id: false });

  User = mongoService.getMongoose().model('Users', this.userSchema);

  constructor() {
    log('Created new instance of UserDao');
  }

  async addUser(userFields: CreateUserDto) {
    const userId = shortid.generate();
    const user = new this.User({
      _id: userId,
      ...userFields,
      permissionFlags: PermissionFlag.FREE_PERMISSION,
    });
    await user.save();
    return userId;
  }
  
  async getUserByEmail(email: string) {
    return this.User.findOne({ email: email }).exec();
  }

  async getUserByEmailWithPassword(email: string) {
    return this.User.findOne({ email: email })
      .select('_id email permissionFlags +password')
      .exec();
  }

  async removeUserById(userId: string) {
    return this.User.deleteOne({ _id: userId }).exec();
  }

  async getUserById(userId: string) {
    return this.User.findOne({ _id: userId }).populate('User').exec();
  }

  async getUsers(limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async updateUserById(
    userId: string,
    userFields: PatchUserDto | PutUserDto
  ) {
    const existingUser = await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec();

    return existingUser;
  }
}

export default new UserDao();
