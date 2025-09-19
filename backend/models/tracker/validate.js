import Joi from "joi";

/**
 * Middleware de validacion para el registro de usuarios
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const validateNewTracker = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(64).required(),
    link: Joi.string().min(5).max(100).email().required(),
    traceInterval: Joi.string().min(2).max(100).email().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
