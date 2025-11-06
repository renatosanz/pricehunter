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
          email: {
            [Op.like]: `%${search}%`,
          },
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

/**
 * Crear nuevo usuario o administrador
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 */
export const createUser = async (req, res) => {
  try {
    const userData = req.body;
    if (await User.findOne({ where: { email: userData.email } })) {
      return res.json({
        success: false,
        message: "Email ya en uso. Usa un email diferente o inicia sesion.",
      });
    }
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.password, salt, async (err, hash) => {
        await User.create({ ...userData, password: hash });
        const okMessage = `${userData.role == "user" ? "Usuario" : "Admin"} ${
          userData.name
        } creado correctamente`;
        return res.status(200).json({
          success: true,
          message: okMessage,
        });
      });
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
 * Eliminar usuario por su ID
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) {
    return res.status(404).json({
      success: false,
      message: "ID de usuario inválido",
    });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado.",
      });
    }

    if (user.isLogged) {
      return res.status(200).json({
        success: false,
        message:
          "Usuario con sesion activa, solo es posible eliminar usuarios con sesiones inactivas.",
      });
    }

    const okMessage = `Usuario ${user.name} eliminado correctamente`;
    await user.destroy();
    return res.status(200).json({
      success: true,
      message: okMessage,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar rastreador",
    });
  }
};

/**
 * Editar datos de un usuario
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 */
export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;

    const user = await User.findByPk(id, {
      attributes: ["name", "email", "phone", "role", "id"],
    });

    await user.update({
      name,
      email,
      phone,
      role,
    });

    return res.status(200).json({
      success: true,
      update: user,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al editar usuario",
    });
  }
};
