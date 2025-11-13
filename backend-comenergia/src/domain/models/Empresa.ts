import mongoose, { Schema, Document } from "mongoose";

export interface IEmpresa extends Document {
  empresa: string;
  descripcion: string;
  servicios: string[];
  email?: string;
  rating?: number;
}

const EmpresaSchema = new Schema<IEmpresa>(
  {
    empresa: { type: String, required: true, unique: true },
    descripcion: { type: String, required: true },
    servicios: { type: [String], required: true, default: [] },
    email: { type: String },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Empresa ||
  mongoose.model<IEmpresa>("Empresa", EmpresaSchema);
