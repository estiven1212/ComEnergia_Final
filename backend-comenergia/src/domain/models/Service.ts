import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  title: string;
  resumen?: string;
  empresa: string;
  user?: string;
  fecha: string;
}

const ServiceSchema = new Schema<IService>({
  title: { type: String, required: true },
  resumen: { type: String },
  empresa: { type: String, required: true },
  user: { type: String },
  fecha: { type: String, default: () => new Date().toISOString() },
});

//  Evita OverwriteModelError
export default mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
