import Joi from 'joi';

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  next();
};

const validateProfileUpdate = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2),
    email: Joi.string().email()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  next();
};

const validateChangePassword = (req, res, next) => {
  const schema = Joi.object({
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  next();
};

export default {
  validateLogin,
  validateProfileUpdate,
  validateChangePassword
};
