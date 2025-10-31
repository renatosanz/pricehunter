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
    link: Joi.string().min(5).uri().required(),
    sms_enabled: Joi.boolean().required(),
    email_enabled: Joi.boolean().required(),
    traceInterval: Joi.number().min(0).max(1440).required(),
    target_price: Joi.number().min(0).max(999999),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

/**
 * Middleware de validacion para restablecer un rastreador
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const validateRestoreTracker = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.number().min(0).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
