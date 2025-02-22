import Joi from 'joi';

const voucherSchema = Joi.object({
  amounts: Joi.array()
    .items(
      Joi.object({
        value: Joi.number().positive().required().messages({
          'number.base': 'Each amount must be a number',
          'number.positive': 'Amount must be positive',
          'any.required': 'Amount value is required',
        }),
        count: Joi.number().integer().min(1).required().messages({
          'number.base': 'Count must be a number',
          'number.integer': 'Count must be an integer',
          'number.min': 'Count must be at least 1',
          'any.required': 'Count is required',
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'Amounts must be an array',
      'array.min': 'At least one amount is required',
      'any.required': 'Amounts are required',
    }),
  description: Joi.string().optional().messages({
    'string.base': 'Description must be a string',
  }),
});

const voucherEditSchema = Joi.object({
  amounts: Joi.array()
    .items(
      Joi.object({
        value: Joi.number().positive().messages({
          'number.base': 'Each amount must be a number',
          'number.positive': 'Amount must be positive',
        }),
        count: Joi.number().integer().min(1).messages({
          'number.base': 'Count must be a number',
          'number.integer': 'Count must be an integer',
          'number.min': 'Count must be at least 1',
        }),
      })
    )
    .optional(),
  description: Joi.string().optional().messages({
    'string.base': 'Description must be a string',
  }),
});

export const validateVoucherRequest = (req, res, next) => {
  const { error } = voucherSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ errors: error.details.map(err => err.message) });
  }
  
  next();
};

export const validateVoucherEdit = (req, res, next) => {
  const { error } = voucherEditSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ errors: error.details.map(err => err.message) });
  }
  
  next();
};
