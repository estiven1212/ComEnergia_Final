import Empresa from "../../domain/models/Empresa";

export const EmpresaRepository = {
  async create(data: any) {
    return await Empresa.create(data);
  },

  async getAll() {
    return await Empresa.find();
  },

  async findByName(nombre: string) {
    return await Empresa.findOne({ nombre });
  }
};
