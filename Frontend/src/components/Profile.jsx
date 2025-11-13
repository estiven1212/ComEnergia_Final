import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getCurrent,
  logoutUser,
  getSolicitudes,
  saveRespuestaConArchivo,
  calificarSolicitud,
  actualizarSolicitud,
} from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(getCurrent());
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respuestaMap, setRespuestaMap] = useState({});
  const [selected, setSelected] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const navigate = useNavigate();

  const fetchSolicitudes = async () => {
    try {
      if (!user?.email) return;
      const data = await getSolicitudes(user.email);
      setSolicitudes(data || []);
    } catch (err) {
      console.error("Error al cargar solicitudes:", err);
      alert("Error al cargar solicitudes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUser(getCurrent());
    fetchSolicitudes();
  }, [user?.email]);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const handleResponder = async (id) => {
    const texto = respuestaMap[id];
    if (!texto?.trim()) return alert("Debe escribir una respuesta");
    try {
      await saveRespuestaConArchivo(id, "respondida", texto, archivo);
      setRespuestaMap({ ...respuestaMap, [id]: "" });
      setArchivo(null);
      setSelected(null);
      fetchSolicitudes();
    } catch (err) {
      console.error("Error al responder:", err);
      alert("Error al responder la solicitud");
    }
  };

  const handleCalificar = async (id, stars) => {
    try {
      await calificarSolicitud(id, stars);
      setSelected(null);
      fetchSolicitudes();
    } catch (err) {
      console.error("Error al calificar:", err);
      alert("Error al calificar la solicitud");
    }
  };

 const handleActualizar = async (id, estado = null, notaTexto = null) => {
  try {
    // notaTexto debe ser string o null
    await actualizarSolicitud(id, estado, notaTexto, user.email);
    fetchSolicitudes();
    // actualizar selected si está abierto (opcional para que muestre cambios)
    if (selected && selected._id === id) {
      const updated = await getSolicitudes(user.email);
      const found = updated.find((s) => s._id === id);
      setSelected(found || null);
      setSolicitudes(updated);
    }
  } catch (err) {
    console.error("Error al actualizar:", err);
    alert("Error al actualizar la solicitud");
  }
};

  // Mis solicitudes (las que hice)
  const solicitudesHechas = solicitudes.filter((s) => s.user === user?.email);
  // Las que me hicieron a mi empresa
  const solicitudesRecibidas = solicitudes.filter(
    (s) => s.empresa === user?.empresa
  );

  const puedeEditar =
    user?.role === "empresa" && selected?.empresa === user?.empresa;

  return (
    <motion.main
      className="min-h-screen bg-gradient-to-b from-black via-[#001a12] to-[#013220] text-white pt-28 pb-16 px-6 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg p-10 rounded-3xl border border-[#07a68a]/30 shadow-2xl">
        {/* === Header === */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#07a68a] mb-1">
              Bienvenido, {user?.name || "Usuario"}
            </h1>
            <div className="text-gray-300 leading-relaxed">
              <p><strong>Rol:</strong> {user?.role || "-"}</p>
              {user?.empresa && <p><strong>Empresa:</strong> {user.empresa}</p>}
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Teléfono:</strong> {user?.telefono || user?.celular || "No registrado"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-[#07a68a] text-white rounded-full font-medium hover:brightness-110 transition-all shadow-md"
          >
            Cerrar sesión
          </button>
        </div>

        <hr className="border-gray-500/30 mb-8" />

        {/* === Mis solicitudes === */}
        <h2 className="text-2xl font-semibold mb-4 text-[#07a68a]">Mis solicitudes</h2>
        {loading ? (
          <p className="text-gray-400">Cargando...</p>
        ) : solicitudesHechas.length === 0 ? (
          <p className="text-gray-400 mb-6">Aún no has realizado ninguna solicitud.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5 mb-12">
            {solicitudesHechas.map((sol) => (
              <motion.div
                key={sol._id}
                onClick={() => setSelected(sol)}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer bg-black/40 p-5 rounded-2xl border border-white/10 hover:border-[#07a68a]/40 transition-all shadow-sm"
              >
                <h3 className="text-[#07a68a] font-semibold text-lg">{sol.servicio}</h3>
                <p className="text-sm text-gray-300 line-clamp-2">{sol.descripcion}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Estado: <span className="font-semibold">{sol.estado}</span>
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* === Solicitudes recibidas === */}
        {user?.role === "empresa" && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-[#07a68a]">Solicitudes recibidas</h2>
            {solicitudesRecibidas.length === 0 ? (
              <p className="text-gray-400">No tienes solicitudes aún.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {solicitudesRecibidas.map((sol) => (
                  <motion.div
                    key={sol._id}
                    onClick={() => setSelected(sol)}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer bg-black/40 p-5 rounded-2xl border border-white/10 hover:border-[#07a68a]/40 transition-all shadow-sm"
                  >
                    <h3 className="text-[#07a68a] font-semibold text-lg">{sol.servicio}</h3>
                    <p className="text-sm text-gray-300 line-clamp-2">{sol.descripcion}</p>
                    <p className="text-xs text-gray-400 mt-1">Solicitante: {sol.user}</p>
                    <p className="text-xs text-gray-400">Estado: {sol.estado}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* === Modal Detalle === */}
        <AnimatePresence>
          {selected && (
            <motion.div
              className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white/10 backdrop-blur-lg border border-[#07a68a]/40 rounded-2xl p-6 w-full max-w-lg relative shadow-2xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <button onClick={() => setSelected(null)} className="absolute top-3 right-3 text-gray-300 hover:text-white text-lg">✖</button>

                <h3 className="text-2xl font-bold text-[#07a68a] mb-2">{selected.servicio}</h3>
                <p className="text-gray-300 mb-2"><strong>Empresa:</strong> {selected.empresa}</p>
                <p className="text-gray-300 mb-2"><strong>Solicitante:</strong> {selected.user}</p>
                <p className="text-gray-300 mb-4">{selected.descripcion}</p>

                {/* === Respuesta === */}
                {selected.respuesta && (
                  <div className="mt-3 bg-white/5 p-3 rounded-lg border border-[#07a68a]/30">
                    <p className="text-gray-200"><strong>Respuesta:</strong> {selected.respuesta}</p>
                  </div>
                )}

                {/* === Gestión (solo empresa receptora) === */}
                {puedeEditar && (
                  <div className="mt-4 border-t border-white/20 pt-4">
                    <label className="block text-sm text-gray-300 mb-2">Cambiar estado:</label>
                    <select
                      value={selected.estado}
                      onChange={(e) => handleActualizar(selected._id, e.target.value, null, user.email)}
                      className="w-full bg-white/10 border border-gray-500 text-white rounded-lg p-2 mb-3"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en revisión">En revisión</option>
                      <option value="en proceso">En proceso</option>
                      <option value="aprobada">Aprobada</option>
                      <option value="rechazada">Rechazada</option>
                    </select>
                  </div>
                )}

                {/* === Notas (ambos roles) === */}
                <div className="mt-4 border-t border-white/20 pt-4">
                  <textarea
                    placeholder="Agregar nota (Enter para guardar)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleActualizar(selected._id, null, e.target.value, user.email);
                        e.target.value = "";
                      }
                    }}
                    className="w-full p-2 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07a68a]"
                  />
                  {selected.notas?.length > 0 && (
  <div className="mt-3 bg-white/5 p-3 rounded-lg border border-[#07a68a]/30">
    <p className="text-[#09ffd0] font-semibold mb-2">Notas:</p>
    {selected.notas.map((n, i) => (
      <p key={i} className="text-xs text-gray-300 mb-1">
        🗓️ {new Date(n.fecha).toLocaleString()} — 
        <span className="text-[#07a68a] ml-1">{n.autor}</span> ({n.rol}): {n.texto}
      </p>
    ))}
  </div>
)}
                </div>

               {/* === Calificación (solo si aprobada o rechazada) === */}
{["aprobada", "rechazada"].includes(selected.estado) &&
 !selected.calificacion &&
 selected.user === user.email && (
  <div className="mt-3 flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        onClick={() => handleCalificar(selected._id, s)}
        className="cursor-pointer text-yellow-400 text-xl hover:scale-110 transition-transform"
      >
        ★
      </span>
    ))}
  </div>
)}
                {selected.calificacion && (
                  <p className="mt-3 text-yellow-400">Calificación: {selected.calificacion}/5</p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
}
