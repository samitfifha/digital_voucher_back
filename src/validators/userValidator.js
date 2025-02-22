import Joi from 'joi';

class UserValidator {
  static validateCreateUser(data) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      phone: Joi.string().pattern(/^\d+$/).required(),
      role: Joi.string().valid('admin', 'user').required(),
    });

    return schema.validate(data);
  }

  static validateUpdateUser(data) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50),
      email: Joi.string().email(),
      phone: Joi.string().pattern(/^\d+$/),
      role: Joi.string().valid('admin', 'user'),
    });

    return schema.validate(data);
  }
}

export default UserValidator;
