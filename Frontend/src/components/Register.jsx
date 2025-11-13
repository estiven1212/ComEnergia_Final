import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { registerUser, getEmpresas, addEmpresa } from "../utils/auth";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    celular: "",
    role: "usuario",
    empresa: "",
    descripcion: "",
    servicios: [],
  });

  const [empresas, setEmpresas] = useState([]);
  const [newEmpresa, setNewEmpresa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const serviciosCatalogo = [
    "Instalación fotovoltaica comunitaria",
    "Capacitación y formación técnica",
    "Sistemas de almacenamiento (baterías)",
    "Mantenimiento y soporte técnico",
    "Movilidad eléctrica comunitaria",
    "Auditoría energética",
  ];

  useEffect(() => {
    getEmpresas().then(setEmpresas).catch(console.error);
  }, []);

  const validarFormulario = () => {
    const { name, email, password, celular, role } = form;

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]+)+$/.test(name)) {
      return "Por favor ingresa tu nombre completo (nombre y apellido, solo letras).";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Por favor ingresa un correo electrónico válido.";
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) {
      return "La contraseña debe tener al menos 8 caracteres, con mayúsculas, minúsculas, números y símbolos.";
    }
    if (!/^\d{10}$/.test(celular)) {
      return "El número de celular debe tener exactamente 10 dígitos.";
    }
    if (role === "empresa" && newEmpresa) {
      if (!form.empresa || !form.descripcion || form.servicios.length === 0) {
        return "Por favor completa todos los campos de la empresa y selecciona al menos un servicio.";
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validarFormulario();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      console.log("Datos a registrar:", form);
      await registerUser(form);

      if (form.role === "empresa" && newEmpresa) {
        await addEmpresa({
          empresa: form.empresa,
          descripcion: form.descripcion,
          servicios: form.servicios,
          email: form.email,
          rating: 4.5,
        });

        //refrescar la lista en tiempo real
        await getEmpresas().then(setEmpresas);
      }

      setSuccess("Registro exitoso. Redirigiendo...");
      setTimeout(() => (window.location.href = "/profile"), 1500);
    } catch (err) {
      console.error("Error de registro:", err);
      setError(err.message || "Error al registrar. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (servicio) => {
    setForm((prev) => {
      const selected = prev.servicios.includes(servicio)
        ? prev.servicios.filter((s) => s !== servicio)
        : [...prev.servicios, servicio];
      return { ...prev, servicios: selected };
    });
  };

  return (
    <motion.main
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#001a12] to-[#013220] py-16 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/10 backdrop-blur-2xl border border-[#07a68a]/40 shadow-2xl p-10 rounded-3xl w-full max-w-3xl text-white"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2 className="text-4xl font-bold text-center text-[#07a68a] mb-8">
          Crear cuenta
        </h2>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-400/30 rounded-xl p-2 text-center mb-4">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-400 text-sm bg-green-500/10 border border-green-400/30 rounded-xl p-2 text-center mb-4">
            {success}
          </p>
        )}

        {/* Campos principales */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-300">Nombre completo</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Juan Pérez"
              className="w-full mt-1 p-3 bg-black/30 border border-white/30 rounded-xl focus:ring-2 focus:ring-[#07a68a]"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Correo electrónico</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="correo@gmail.com"
              className="w-full mt-1 p-3 bg-black/30 border border-white/30 rounded-xl focus:ring-2 focus:ring-[#07a68a]"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Contraseña</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="********"
              className="w-full mt-1 p-3 bg-black/30 border border-white/30 rounded-xl focus:ring-2 focus:ring-[#07a68a]"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Teléfono celular</label>
            <input
              type="tel"
              value={form.celular}
              onChange={(e) => setForm({ ...form, celular: e.target.value })}
              placeholder="3001234567"
              className="w-full mt-1 p-3 bg-black/30 border border-white/30 rounded-xl focus:ring-2 focus:ring-[#07a68a]"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Rol</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full mt-1 p-3 bg-black/30 border border-white/30 rounded-xl focus:ring-2 focus:ring-[#07a68a]"
            >
              <option value="usuario">Usuario</option>
              <option value="empresa">Empresa</option>
            </select>
          </div>
        </div>

        {/* Datos empresa */}
        {form.role === "empresa" && (
          <motion.div
            className="mt-6 bg-white/10 border border-white/20 rounded-2xl p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={newEmpresa}
                onChange={(e) => setNewEmpresa(e.target.checked)}
              />
              <span className="text-sm text-gray-200">
                Registrar nueva empresa
              </span>
            </div>

            {!newEmpresa ? (
              <select
                value={form.empresa}
                onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                className="w-full p-3 bg-black/30 border border-white/30 rounded-xl focus:ring-2 focus:ring-[#07a68a]"
              >
                <option value="">Selecciona una empresa existente</option>
                {empresas.map((e, i) => (
                  <option key={i} value={e.empresa}>
                    {e.empresa}
                  </option>
                ))}
              </select>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-300">
                      Nombre de la empresa
                    </label>
                    <input
                      type="text"
                      value={form.empresa}
                      onChange={(e) =>
                        setForm({ ...form, empresa: e.target.value })
                      }
                      className="w-full mt-1 p-3 bg-black/30 border border-white/30 rounded-xl focus:ring-2 focus:ring-[#07a68a]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300">Descripción</label>
                    <input
                      type="text"
                      value={form.descripcion}
                      onChange={(e) =>
                        setForm({ ...form, descripcion: e.target.value })
                      }
                      className="w-full mt-1 p-3 bg-black/30 border border-white/30 rounded-xl focus:ring-2 focus:ring-[#07a68a]"
                      placeholder="Ej: Auditoría o instalación solar"
                      required
                    />
                  </div>
                </div>

                <label className="block text-sm text-gray-300 mt-4 mb-2">
                  Servicios ofrecidos
                </label>

                <div className="grid md:grid-cols-2 gap-3">
                  {serviciosCatalogo.map((s, i) => (
                    <label
                      key={i}
                      className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer border transition ${
                        form.servicios.includes(s)
                          ? "border-[#07a68a] bg-[#07a68a]/10"
                          : "border-white/20 bg-black/20 hover:border-[#07a68a]/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.servicios.includes(s)}
                        onChange={() => toggleService(s)}
                      />
                      <span className="text-sm text-gray-200">{s}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className="w-full mt-8 py-3 bg-[#07a68a] hover:brightness-110 text-white rounded-xl font-semibold shadow-md transition"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </motion.button>
      </motion.form>
    </motion.main>
  );
}
