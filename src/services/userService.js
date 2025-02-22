import User from '../models/User.js';
import Voucher from '../models/Voucher.js';

class UserService {
  static async createUser(userData) {
    const { email } = userData;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email already in use');

    const user = new User(userData);
    return await user.save();
  }

  static async getAllUsers() {
    return await User.find({});
  }

  static async getUserById(userId) {
    return await User.findById(userId);
  }

  static async updateUser(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) return null;

    Object.assign(user, updateData);
    return await user.save({ validateModifiedOnly: true });
  }

  static async getUserRequests(userId) {
    return await Voucher.find({ userId });
  }
}

export default UserService;
