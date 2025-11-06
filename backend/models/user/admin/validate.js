import Joi from "joi";

/**
 * Middleware de validacion para login de usuarios
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const validateNewUserByAdmin = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().min(2).max(100).email().required(),
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string()
      .min(10)
      .max(15)
      .regex(/^\d{10}$/)
      .required(),
    password: Joi.string().min(2).max(100).required(),
    password_validate: Joi.string().equal(req.body.password).required(),
    role: Joi.string().valid("user", "admin").required().messages({
      "any.only": 'El rol debe ser "user" o "admin"',
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

/**
 * Middleware de validacion de edicion de usuarios
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const validateEditUserByAdmin = async (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      success: false,
      message: "ID de Usuario inválido",
    });
  }

  const schema = Joi.object({
    email: Joi.string().min(2).max(100).email().required(),
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string()
      .min(10)
      .max(15)
      .regex(/^\d{10}$/)
      .required(),
    role: Joi.string().valid("user", "admin").required().messages({
      "any.only": 'El rol debe ser "user" o "admin"',
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
