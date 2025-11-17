import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "./model.js";
process.loadEnvFile();

// @ts-check

/**
 * Middleware de autenticación
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function isAuthenticated(req, res, next) {
  const { access_token } = req.cookies;

  if (!access_token) {
    console.log("Sesion no verificada");
    return res.status(403).send("Sesion no verificada: falta token.");
  }

  jwt.verify(access_token, process.env.SEED_AUTENTICACION, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res
        .clearCookie("access_token", {
          sameSite: "none",
          httpOnly: true,
          secure: true,
        })
        .status(403)
        .json({ success: false });
    } else {
      req.user = { id: decoded.user, role: decoded.role };
      return next();
    }
  });
}

/**
 * Manejo de login de usuario
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 */
export const userLogin = async (req, res) => {
  try {
    const body = req.body;
    // busca la usuario en la db
    const user_db = await User.findOne({
      where: { email: body.email },
    });
    if (!user_db) {
      return res.json({
        success: false,
        message: "Usuario no valido.",
      });
    }
    if (user_db.isBanned) {
      return res.json({
        success: false,
        message:
          "Usuario desactivado temporalmente. Contacta a Soporte Tecnico para saber más.",
      });
    }

    // valida que la contraseña escrita por el usuario, sea la almacenada en la db
    if (!bcrypt.compareSync(body.password, user_db.password)) {
      1;
      return res.json({
        success: false,
        message: "Usuario o contraseña incorrectos",
      });
    }

    // crear token de sesion
    const token = jwt.sign(
      { user: user_db.id, role: user_db.role },
      process.env.SEED_AUTENTICACION || "",
      { expiresIn: process.env.CADUCIDAD_TOKEN },
    );
    user_db.lastLogin = new Date();
    user_db.isLogged = true;
    await user_db.save();
    return res
      .cookie("access_token", token, {
        maxAge: 86400000,
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .json({ success: true });
  } catch (error) {
    console.error("Error al iniciar sesion:", error);
    return res.status(500).json({
      success: false,
      message: "Algo salio mal.",
    });
  }
};

/**
 * Manejo de logout de usuario
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 */
export const userLogOut = async (req, res) => {
  const { access_token } = req.cookies;

  if (!access_token) {
    return res
      .clearCookie("access_token", {
        sameSite: "none",
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .json({ success: true, message: "No active session" });
  }

  try {
    const decoded = jwt.verify(
      access_token,
      process.env.SEED_AUTENTICACION || "",
    );
    const { user } = decoded;
    const user_db = await User.findOne({ where: { id: user } });

    if (user_db) {
      user_db.isLogged = false;
      await user_db.save();
    }

    return res
      .clearCookie("access_token", {
        sameSite: "none",
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.log("Error during logout:", error);
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res
        .clearCookie("access_token", {
          sameSite: "none",
          httpOnly: true,
          secure: true,
        })
        .status(200)
        .json({ success: true, message: "Session expired" });
    }

    return res.status(500).json({
      success: false,
      message: "Error during logout",
      error: error.message,
    });
  }
};
