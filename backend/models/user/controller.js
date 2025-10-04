import { User } from "./model.js";
import bcrypt from "bcrypt";

/**
 * Manejo de registro de usuarios
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const registerUser = async (req, res) => {
  const user = req.body;
  try {
    if (await User.findOne({ where: { email: user.email } })) {
      return res.json({
        success: false,
        message: "Email ya en uso. Usa un email diferente o inicia sesion.",
      });
    }
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.password, salt, async (err, hash) => {
        user.password = hash;
        await User.create(user);
        return res.status(201).json({
          success: true,
          message: "Gracias por registrarte",
        });
      });
    });
  } catch (error) {
    console.error("Error: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
    });
  }
};

/**
 * Retornar informacion del usuario
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 */
export const getUserData = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["name", "email"],
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no valido.",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error al obtener informacion del usuario:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener informacion del usuario",
    });
  }
};
