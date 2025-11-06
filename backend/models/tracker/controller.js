import { Op } from "sequelize";
import { Tracker } from "./model.js";
import { getHistoryData, verifyDomainLink } from "./utils.js";

/**
 * Crear un nuevo tracker de precios
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 */
export const newTracker = async (req, res) => {
  try {
    const user = req.user;
    const {
      name,
      link,
      traceInterval,
      sms_enabled,
      email_enabled,
      target_price = 0,
    } = req.body;

    const tracker = await Tracker.findOne({
      where: {
        user_id: user.id,
        name: name,
      },
    });

    if (tracker) {
      return res.status(200).json({
        success: false,
        message: "Nombre no disponible",
      });
    }

    if (!verifyDomainLink(link)) {
      return res.status(200).json({
        success: false,
        message: "Link invalido, e-commerce no soportado.",
      });
    }

    const newTracker = await Tracker.create({
      name: name,
      link: link,
      traceInterval: traceInterval,
      user_id: user.id,
      sms_enabled: sms_enabled,
      email_enabled: email_enabled,
      target_price: target_price,
    });
    return res.status(201).json({
      success: true,
      tracker: {
        name: newTracker.name,
        id: newTracker.id,
      },
    });
  } catch (error) {
    console.error("Error: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al crear rastreador",
    });
  }
};

/**
 * Obtener todos los trackers de un usuario
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 */
export const allTrackers = async (req, res) => {
  try {
    const user = req.user;
    const trackers = await Tracker.findAll({
      where: { user_id: user.id },
      attributes: ["name", "id", "link", "traceInterval", "active"],
      limit: 10,
    });

    return res.status(200).json({
      success: true,
      trackers,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al obtener todos los rastreadores",
    });
  }
};

/**
 * Obtener detalles del rastreador por medio de su id
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 */
export const getTrackerDetails = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      success: false,
      message: "ID de rastreador inválido",
    });
  }

  try {
    const tracker = await Tracker.findByPk(id, {
      where: { user_id: userId },
    });

    if (!tracker) {
      return res.status(400).json({
        success: false,
        message: "Rastreador no encontrado.",
      });
    }

    const price_history = await getHistoryData(tracker.id);
    return res.status(200).json({
      success: true,
      tracker: tracker,
      price_history,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al obtener los detalles del rastreador",
    });
  }
};

/**
 * Eliminar rastreador por medio de su id
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 */
export const deleteTracker = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      success: false,
      message: "ID de rastreador inválido",
    });
  }

  try {
    const tracker = await Tracker.findByPk(id, {
      where: { user_id: userId },
    });

    if (!tracker) {
      return res.status(200).json({
        success: false,
        message: "Rastreador no encontrado.",
      });
    }

    await tracker.destroy();
    return res.status(200).json({
      success: true,
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
 * Obtener todos los trackers eliminados de un usuario
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 */
export const historyTrackers = async (req, res) => {
  try {
    const user = req.user;
    const trackers = await Tracker.findAll({
      where: {
        user_id: user.id,
        deletedAt: {
          [Op.not]: null,
        },
      },
      attributes: [
        "name",
        "id",
        "link",
        "traceInterval",
        "active",
        "target_price",
      ],
      paranoid: false,
      limit: 10,
    });

    return res.status(200).json({
      success: true,
      trackers,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al obtener todos los rastreadores",
    });
  }
};

/**
 * Reactivar rastreador por medio de su id
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 */
export const restoreTracker = async (req, res) => {
  try {
    const { id } = req.body;
    const tracker = await Tracker.findByPk(id, {
      attributes: [
        "name",
        "id",
        "link",
        "traceInterval",
        "active",
        "target_price",
      ],
      paranoid: false,
    });
    await tracker.restore();
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al obtener todos los rastreadores",
    });
  }
};

/**
 * Editar datos de un rastreador
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 */
export const editTracker = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "ID de rastreador inválido",
      });
    }

    const { email_enabled, sms_enabled, name, traceInterval, target_price } =
      req.body;

    const tracker = await Tracker.findByPk(id, {
      attributes: [
        "name",
        "id",
        "link",
        "traceInterval",
        "active",
        "target_price",
      ],
    });
    await tracker.update({
      email_enabled,
      sms_enabled,
      name,
      traceInterval,
      target_price,
    });
    return res.status(200).json({
      success: true,
      update: tracker,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al editar rastreador",
    });
  }
};
