import UserService from '../services/userService.js';
import UserValidator from '../validators/userValidator.js';

/**
 * @desc Create a new user
 */
export const createUser = async (req, res, next) => {
  try {
    // Validate request data
    const { error } = UserValidator.validateCreateUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get user by ID
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update user info
 */
export const updateUser = async (req, res, next) => {
  try {
    // Validate request data
    const { error } = UserValidator.validateUpdateUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updatedUser = await UserService.updateUser(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get user requests
 */
export const getUserRequests = async (req, res, next) => {
  try {
    const requests = await UserService.getUserRequests(req.params.id);
    res.json(requests);
  } catch (error) {
    next(error);
  }
};
