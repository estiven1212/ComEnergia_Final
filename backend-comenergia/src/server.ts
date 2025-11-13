import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";

import userRoutes from "./infrastructure/routes/UserRoutes";
import solicitudRoutes from "./infrastructure/routes/solicitudRoutes";
import empresaRoutes from "./infrastructure/routes/EmpresaRoutes";
import serviceRoutes from "./infrastructure/routes/ServiceRoutes";

dotenv.config();
const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:4000",
    "https://com-energia-final-eqn4-9sw7rosoz-estiven1212s-projects.vercel.app",
    "https://com-energia-final.vercel.app",
    /^https:\/\/com-energia-final.*\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// Servir archivos estáticos
import path from "path";
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//Chequeo en render
app.get("/api/health", (req, res) => {
  res.status(200).json({status: "OK", message: "Servidor funcionando correctamente"});
});

// Registrar rutas
app.use("/api/users", userRoutes);
app.use("/api/solicitudes", solicitudRoutes);
app.use("/api/empresas", empresaRoutes);
app.use("/api/services", serviceRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));