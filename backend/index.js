import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { db } from "./db.js";

//import routes
import userRoutes from "./models/user/routes.js";
import trackerRoutes from "./models/tracker/routes.js";
import { create_default_admins } from "./models/user/model.js";

const PORT = 3000;

const app = express();
app.use(
  cors({
    // Local development
    origin: "http://localhost:5173",
    credentials: true, // permitir las server side cookies2
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());
app.use(express.json());

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
    console.log("Base de datos sincronizada.");

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al inicializar la aplicación:", error);
  }
})();
