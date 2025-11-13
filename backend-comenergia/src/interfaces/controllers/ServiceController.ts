import { Request, Response } from "express";
import Service from "../../domain/models/Service";

// Obtener todos los servicios
export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los servicios" });
  }
};

// Guardar un nuevo servicio
export const saveService = async (req: Request, res: Response) => {
  try {
    const { title, resumen, empresa, user } = req.body;
    if (!title || !empresa) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const nuevo = new Service({
      title,
      resumen,
      empresa,
      user,
      fecha: new Date().toISOString(),
    });
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el servicio" });
  }
};
