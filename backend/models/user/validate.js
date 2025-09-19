import Joi from "joi";

/**
 * Middleware de validacion para login de usuarios
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const validateLogIn = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().min(2).max(100).email().required(),
    password: Joi.string().min(2).max(100).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

/**
 * Middleware de validacion para el registro de usuarios
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const validateRegister = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().min(2).max(100).email().required(),
    name: Joi.string().min(2).max(100).required(),
    password: Joi.string().min(2).max(100).required(),
    password_validate: Joi.string().equal(req.body.password).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
