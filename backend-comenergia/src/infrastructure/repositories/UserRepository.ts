import User from "../../domain/models/User";

export const UserRepository = {
  async create(userData: any) {
    return await User.create(userData);
  },

  async findByEmail(email: string) {
    return await User.findOne({ email });
  },

  async getAllEmpresas() {
    return await User.find({ role: "empresa" }, "empresa email celular");
  }
};
