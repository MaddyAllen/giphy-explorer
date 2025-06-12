import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from './error';

export const schemas = {
  rating: Joi.object({
    gifId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required()
  }),
  comment: Joi.object({
    gifId: Joi.string().required(),
    content: Joi.string().min(1).max(500).required()
  }),
  user: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      return next(new AppError(errorMessage, 400));
    }

    next();
  };
}; 