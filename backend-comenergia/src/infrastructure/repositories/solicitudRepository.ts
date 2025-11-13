import Solicitud from "../../domain/models/Solicitud";

export const SolicitudRepository = {
  async create(data: any) {
    return await Solicitud.create(data);
  },

  async getByEmail(email: string) {
    return await Solicitud.find({
      $or: [{ user: email }, { destinatarios: email }]
    });
  },

  async getByEmpresa(nombreEmpresa: string) {
    return await Solicitud.find({ empresa: nombreEmpresa });
  },

  async updateEstado(id: string, estado: string) {
    return await Solicitud.findByIdAndUpdate(id, { estado }, { new: true });
  },

  async responder(id: string, respuesta: string, estado: string) {
    return await Solicitud.findByIdAndUpdate(
      id,
      {
        respuesta,
        estado,
        fechaRespuesta: new Date(),
      },
      { new: true }
    );
  }
};
