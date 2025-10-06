import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { db } from "./db.js";

//import routes
import userRoutes from "./models/user/routes.js";
import trackerRoutes from "./models/tracker/routes.js";

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // declarar el frontend en desarrollo
    credentials: true, // permitir las server side cookies2
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // maximo 100 requests
    message: {
      success: false,
      message: "Demasiadas solicitudes, intenta más tarde",
    },
  })
);

app.get("/", (req, res) => {
  res.send("hola desde el server!");
});

app.use("/api/user", userRoutes);
app.use("/api/tracker", trackerRoutes);

app.use(/(.*)/, (req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// iniciar servidor
(async () => {
  try {
    await db.authenticate();
    console.log("Conexión con la base de datos establecida correctamente.");

    //await db.sync({ force: true }); // force para crear las tablas
    await db.sync();
    console.log("Base de datos sincronizada.");

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al inicializar la aplicación:", error);
  }
})();
