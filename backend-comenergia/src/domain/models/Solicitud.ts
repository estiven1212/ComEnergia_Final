import mongoose, { Schema, Document } from "mongoose";

/* ===== Subdocumento para las notas ===== */
export interface INota {
  texto: string;
  autor: string;
  rol: string;
  fecha: Date;
}

/* ===== Interfaz principal ===== */
export interface ISolicitud extends Document {
  servicio: string;
  empresa: string;
  descripcion: string;
  user: string;
  telefono?: string;
  estado: string;
  respuesta?: string;
  calificacion?: number;
  notas?: INota[];
}

/* ===== Esquema de Nota ===== */
const NotaSchema = new Schema<INota>(
  {
    texto: { type: String, required: true },
    autor: { type: String, required: true },
    rol: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
  },
  { _id: false }
);

/* ===== Esquema de Solicitud ===== */
const SolicitudSchema = new Schema<ISolicitud>(
  {
    servicio: { type: String, required: true },
    empresa: { type: String, required: true },
    descripcion: { type: String, required: true },
    user: { type: String, required: true },
    telefono: { type: String, default: "" },
    estado: { type: String, default: "pendiente" },
    respuesta: { type: String, default: null },
    calificacion: { type: Number, default: null },
    notas: [NotaSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Solicitud ||
  mongoose.model<ISolicitud>("Solicitud", SolicitudSchema);
