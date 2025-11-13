// SOLO USADO PARA POBLAR BB INICIAL DE EMPRESAS

import mongoose from "mongoose";
import dotenv from "dotenv";
import Empresa from "../domain/models/Empresa";

dotenv.config();

const empresasData = [
  {
    empresa: "SolarAndes S.A.S.",
    descripcion: "Instalación de sistemas fotovoltaicos comunitarios y asesoría técnica.",
    servicios: ["Instalación fotovoltaica comunitaria"],
    email: "contacto@solarandes.com",
    rating: 4.8,
  },
  {
    empresa: "EnerSolTech Ltda.",
    descripcion: "Especialistas en diseño e implementación de microredes solares.",
    servicios: ["Instalación fotovoltaica comunitaria"],
    email: "info@enersoltech.com",
    rating: 4.6,
  },
  {
    empresa: "EnerBat Ltda.",
    descripcion: "Soluciones de almacenamiento y mantenimiento de baterías industriales.",
    servicios: ["Sistemas de almacenamiento (baterías)"],
    email: "ventas@enerbat.co",
    rating: 4.7,
  },
  {
    empresa: "BatEco Solutions",
    descripcion: "Gestión de baterías para proyectos sostenibles y comunitarios.",
    servicios: ["Sistemas de almacenamiento (baterías)"],
    email: "contacto@bateco.com",
    rating: 4.5,
  },
  {
    empresa: "TechSol Services",
    descripcion: "Servicios técnicos para mantenimiento y soporte de sistemas solares.",
    servicios: ["Mantenimiento y soporte técnico"],
    email: "soporte@techsol.com",
    rating: 4.9,
  },
  {
    empresa: "GreenFix Energy",
    descripcion: "Mantenimiento preventivo y auditorías energéticas comunitarias.",
    servicios: ["Mantenimiento y soporte técnico"],
    email: "info@greenfixenergy.com",
    rating: 4.6,
  },
  {
    empresa: "EnerMov S.A.",
    descripcion: "Proyectos de movilidad eléctrica comunitaria e infraestructura de carga.",
    servicios: ["Movilidad eléctrica comunitaria"],
    email: "contacto@enermov.com",
    rating: 4.5,
  },
  {
    empresa: "VoltCom Mobility",
    descripcion: "Consultoría e instalación de sistemas de movilidad sostenible.",
    servicios: ["Movilidad eléctrica comunitaria"],
    email: "info@voltcom.com",
    rating: 4.4,
  },
  {
    empresa: "EnerAudit",
    descripcion: "Auditorías energéticas y diagnósticos de eficiencia.",
    servicios: ["Auditoría energética"],
    email: "auditoria@eneraudit.com",
    rating: 4.8,
  },
  {
    empresa: "EcoCheck Consulting",
    descripcion: "Consultoría y acompañamiento en eficiencia energética.",
    servicios: ["Auditoría energética"],
    email: "contacto@ecocheck.com",
    rating: 4.6,
  },
];

export const seedEmpresas = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI no definida");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB Atlas");

    await Empresa.deleteMany({});
    console.log("Empresas anteriores eliminadas");

    await Empresa.insertMany(empresasData);
    console.log("Empresas cargadas exitosamente");

    await mongoose.disconnect();
    console.log("🔌 Desconectado de MongoDB");
  } catch (error) {
    console.error("Error al poblar empresas:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedEmpresas();
}
