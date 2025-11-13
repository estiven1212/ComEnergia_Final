import { Request, Response } from "express";
import Empresa from "../../domain/models/Empresa";

// === Obtener todas las empresas ===
export const getEmpresas = async (req: Request, res: Response) => {
  try {
    const empresas = await Empresa.find().sort({ createdAt: -1 });
    res.json(empresas);
  } catch (error) {
    console.error("Error al obtener empresas:", error);
    res.status(500).json({ error: "Error al obtener empresas" });
  }
};

// === Registrar nueva empresa ===
export const addEmpresa = async (req: Request, res: Response) => {
  try {
    console.log("Datos recibidos para empresa:", req.body);
    const { empresa, descripcion, servicios, email, rating } = req.body;

    // Validación segura
    if (
      !empresa ||
      !descripcion ||
      !Array.isArray(servicios) ||
      servicios.length === 0 ||
      !email
    ) {
      console.warn("Datos incompletos al registrar empresa:", req.body);
      return res.status(400).json({ error: "Datos incompletos o inválidos" });
    }

    const existente = await Empresa.findOne({ empresa });
    if (existente) {
      console.warn("Empresa ya existente:", empresa);
      return res.status(400).json({ error: "La empresa ya existe" });
    }

    const nueva = new Empresa({
      empresa,
      descripcion,
      servicios,
      email,
      rating: rating || 0,
    });

    await nueva.save();
    console.log("Empresa registrada correctamente:", nueva);
    res.status(201).json(nueva);
  } catch (error: any) {
    console.error("Error interno al registrar empresa:", error);
    res.status(500).json({ error: error.message || "Error al registrar empresa" });
  }
};
