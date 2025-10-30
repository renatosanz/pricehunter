import { Op } from "sequelize";
import { Tracker } from "../../tracker/model.js";
import { User } from "../model.js";
import bcrypt from "bcrypt";

/**
 * obtener datos estadisticos para el dashboard del administrador
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
    console.error("Error al obtener dashboard de admin:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener dashboard de admin",
    });
  }
};

/**
 * obtener listado de usuarios en la plataforma, incluye paginacion
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 */
export const getUsersDataTable = async (req, res) => {
  const { page_size = 10, page = 1, search = "" } = req.query;
  const limit = parseInt(page_size);
  const offset = (parseInt(page) - 1) * limit;

  try {
    let searchConfig = {
      limit,
      offset,
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    };
    if (search.length > 1) {
      searchConfig = {
        limit,
        offset,
        where: {
          [Op.or]: [
            {
              email: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              name: {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
        attributes: { exclude: ["password"] },
        order: [["createdAt", "DESC"]],
      };
    }

    const { count, rows: users } = await User.findAndCountAll(searchConfig);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error al tabla de usuarios:", error);
    return res.status(500).json({
      success: false,
      message: "Error al tabla de usuarios",
    });
  }
};

export const searchUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      usersCount,
      adminsCount,
      bannedUsers,
      activeUsers,
    });
  } catch (error) {
    console.error("Error al obtener dashboard de admin:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener dashboard de admin",
    });
  }
};
