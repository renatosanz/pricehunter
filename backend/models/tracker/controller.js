import { Tracker } from "./model.js";

/**
 * Crear un nuevo tracker de precios
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 */
export const newTracker = async (req, res) => {
  try {
    const user = req.user;
    const { name, link, traceInterval } = req.body;

    const tracker = await Tracker.findOne({
      where: {
        user_id: user.id,
        name: name,
      },
    });

    if (tracker) {
      return res.status(400).json({
        success: false,
        message: "Nombre no disponible",
      });
    }

    const newTracker = await Tracker.create({
      name: name,
      link: link,
      traceInterval: traceInterval,
      user_id: user.id,
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
  try {
    const tracker = await Tracker.findByPk(req.params.id, {
      where: { user_id: req.user.id },
    });

    if (!tracker) {
      return res.status(400).json({
        success: false,
        message: "Rastreador no encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      tracker: tracker,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al obtener todos los rastreadores",
    });
  }
};
