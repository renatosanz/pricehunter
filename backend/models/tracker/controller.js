import { Tracker } from "./model";

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
        user_id: user,
        name: name,
      },
    });

    if (!tracker) {
      return res.status(201).json({
        success: false,
        message: "Nombre no disponible",
      });
    }

    const newTracker = await Tracker.create({
      name: name,
      link: link,
      traceInterval: traceInterval,
      user_id: user,
    });
    return res.status(201).json({
      success: true,
      tracker: newTracker.name,
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
    const trackers = Tracker.findAll({ where: { user_id: user }, limit: 10 });
    return res.status(200).json({
      success: true,
      trackers,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al verificar disponibilidad de nombre",
    });
  }
};
