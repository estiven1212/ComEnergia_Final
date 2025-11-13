import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/db";

import userRoutes from "./infrastructure/routes/UserRoutes";
import solicitudRoutes from "./infrastructure/routes/solicitudRoutes";
import empresaRoutes from "./infrastructure/routes/EmpresaRoutes";
import serviceRoutes from "./infrastructure/routes/ServiceRoutes"; //  nuevo

dotenv.config();
const app = express();

// Configuración de CORS para que el front (Vite) pueda conectarse
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://com-energia-final-eqn4-9sw7rosoz-estiven1212s-projects.vercel.app",
    "https://com-energia-final.vercel.app", //
    /^https:\/\/com-energia-final.*\.vercel\.app$/ //
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Conectar a MongoDB Atlas
connectDB();

// Registrar rutas
app.use("/api/users", userRoutes);
app.use("/api/solicitudes", solicitudRoutes);
app.use("/api/empresas", empresaRoutes);
app.use("/api/services", serviceRoutes); //nueva ruta

// Servir archivos estáticos si hay adjuntos (respuestas con archivo)
import path from "path";
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (req, res) => {
  res.status(200).json({status: "OK", message: "Servidor funcionando correctamente"});
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
