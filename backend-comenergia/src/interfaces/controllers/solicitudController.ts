import { Request, Response } from "express";
import Solicitud from "../../domain/models/Solicitud";
import Empresa from "../../domain/models/Empresa";
import User from "../../domain/models/User";

/* ===============================
   Crear Solicitud
   =================================*/
export const crearSolicitud = async (req: Request, res: Response) => {
  try {
    const { servicio, empresa, descripcion, userEmail, userTelefono } = req.body;

    if (!servicio || !empresa || !descripcion || !userEmail) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const nueva = await Solicitud.create({
      servicio,
      empresa,
      descripcion,
      user: userEmail,
      telefono: userTelefono || "",
      estado: "pendiente",
    });

    res.status(201).json(nueva);
  } catch (error) {
    console.error("Error al crear solicitud:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/* ===============================
   Obtener solicitudes
   =================================*/
export const obtenerSolicitudes = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const usuario = await User.findOne({ email });

    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    // Devuelve solicitudes que el usuario hizo (user) y las dirigidas a su empresa (empresa)
    const solicitudes = await Solicitud.find({
      $or: [{ user: email }, { empresa: usuario.empresa }],
    }).sort({ createdAt: -1 });

    res.json(solicitudes);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/* ===============================
   Actualizar estado / añadir nota
   =================================*/
export const actualizarSolicitud = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // En body se espera: { estado?, notas?: string, email }
    const { estado, notas, email } = req.body;

    if (!email) return res.status(400).json({ message: "Se requiere email del autor" });

    const usuario = await User.findOne({ email });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    const nuevaNota =
      notas && typeof notas === "string" && notas.trim()
        ? {
            texto: notas.trim(),
            autor: usuario.email,
            rol: usuario.role,
            fecha: new Date(),
          }
        : null;

    const update: any = {};
    if (estado) update.estado = estado;
    if (nuevaNota) {
      update.$push = { notas: nuevaNota };
    }

    const solicitud = await Solicitud.findByIdAndUpdate(id, update, { new: true });
    if (!solicitud) return res.status(404).json({ message: "Solicitud no encontrada" });

    res.json(solicitud);
  } catch (error) {
    console.error("Error al actualizar solicitud:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/* ===============================
   Responder solicitud
   =================================*/
export const responderSolicitud = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Si viene FormData, req.body.respuesta estará en body (multer no lo parsea JSON)
    const respuesta = req.body.respuesta;
    const estado = req.body.estado;

    // Nombre archivo si subieron
    let archivoNombre = "";
    if ((req as any).file) archivoNombre = (req as any).file.originalname;

    const sol = await Solicitud.findByIdAndUpdate(
      id,
      {
        respuesta: respuesta || "",
        estado: estado || "respondida",
        archivo: archivoNombre || undefined,
      },
      { new: true }
    );

    if (!sol) return res.status(404).json({ message: "Solicitud no encontrada" });

    res.json(sol);
  } catch (error) {
    console.error("Error al responder solicitud:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/* ===============================
   📌 Calificar solicitud
   =================================*/
export const calificarSolicitud = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { calificacion } = req.body;

    if (typeof calificacion !== "number" && typeof calificacion !== "string") {
      return res.status(400).json({ message: "Calificación inválida" });
    }
    const calNumber = Number(calificacion);

    const sol = await Solicitud.findByIdAndUpdate(
      id,
      { calificacion: calNumber, estado: "finalizada" },
      { new: true }
    );

    if (sol && sol.empresa) {
      const todas = await Solicitud.find({
        empresa: sol.empresa,
        calificacion: { $ne: null },
      });

      if (todas.length > 0) {
        const promedio =
          todas.reduce((acc, s) => acc + (s.calificacion || 0), 0) / todas.length;

        // Guardar rating como número (1 decimal)
        await Empresa.findOneAndUpdate(
          { empresa: sol.empresa },
          { rating: Number(promedio.toFixed(1)) }
        );
      }
    }

    res.json(sol);
  } catch (error) {
    console.error("Error al calificar solicitud:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
