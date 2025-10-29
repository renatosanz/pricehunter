import { Op } from "sequelize";
import { Tracker } from "../../tracker/model.js";
import { User } from "../model.js";
import bcrypt from "bcrypt";

/**
 * obtener datos para el dashboard principal del usuario
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 */
export const getAdminDashboardData = async (req, res) => {
  try {
    const [usersCount = 0, adminsCount = 0, bannedUsers = 0, activeUsers = 0] =
      await Promise.all([
        User.count({
          where: {
            role: "user",
          },
        }),
        User.count({
          where: {
            role: "admin",
          },
        }),
        User.count({
          where: {
            isBanned: true,
          },
        }),
        User.count({
          where: {
            isLogged: true,
          },
        }),
      ]);

    return res.status(200).json({
      success: true,
      usersCount,
      adminsCount,
      bannedUsers,
      activeUsers,
    });
  } catch (error) {
    console.error("Error al obtener informacion del usuario:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener informacion del usuario",
    });
  }
};
