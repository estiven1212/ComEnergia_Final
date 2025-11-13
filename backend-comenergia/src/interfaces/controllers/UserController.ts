import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../domain/models/User";
import Empresa from "../../domain/models/Empresa";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, celular, role, empresa, descripcion, servicios } = req.body;

    if (!name || !email || !password || !celular)
      return res.status(400).json({ message: "Campos obligatorios faltantes" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "El usuario ya está registrado" });

    let empresaAsociada = null;

    if (role === "empresa") {
      if (!empresa)
        return res.status(400).json({ message: "Debe especificar una empresa" });

      empresaAsociada = await Empresa.findOne({ empresa });

      if (!empresaAsociada) {
        if (!descripcion || !servicios?.length)
          return res.status(400).json({
            message: "Debe proporcionar descripción y servicios para registrar nueva empresa",
          });

        empresaAsociada = await Empresa.create({
          empresa,
          descripcion,
          servicios,
          email,
          rating: 0,
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      celular,
      role,
      empresa: empresaAsociada ? empresaAsociada.empresa : null,
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, empresa: newUser.empresa },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        celular: newUser.celular,
        role: newUser.role,
        empresa: newUser.empresa,
      },
      token,
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user._id, role: user.role, empresa: user.empresa },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        celular: user.celular,
        role: user.role,
        empresa: user.empresa,
      },
    });
  } catch (error) {
    console.error(" Error al iniciar sesión:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
