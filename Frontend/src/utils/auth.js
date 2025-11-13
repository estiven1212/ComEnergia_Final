// src/utils/auth.js
const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL:", API_URL);



/* === Usuario actual === */
export function getCurrent() {
  try {
    const raw = localStorage.getItem("currentUser");
    if (!raw || raw === "undefined" || raw === "null") return null;
    const obj = JSON.parse(raw);
    if (obj && !obj.telefono && (obj.celular || obj.phone)) {
      obj.telefono = obj.celular || obj.phone;
    }
    return obj;
  } catch {
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem("currentUser");
  window.dispatchEvent(new Event("storage"));
}

/* === Registro === */
export async function registerUser(form) {
  const res = await fetch(`${API_URL}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al registrar usuario");

  const payload = { ...(data.user || data), token: data.token || null };
  payload.telefono = payload.telefono || payload.celular || payload.phone || null;
  if (payload.password) delete payload.password;

  localStorage.setItem("currentUser", JSON.stringify(payload));
  window.dispatchEvent(new Event("storage"));
  return payload;
}

/* === Login === */
export async function loginUser({ email, password }) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Credenciales inválidas");

  const payload = { ...(data.user || data), token: data.token || null };
  payload.telefono = payload.telefono || payload.celular || payload.phone || null;
  if (payload.password) delete payload.password;
  localStorage.setItem("currentUser", JSON.stringify(payload));
  window.dispatchEvent(new Event("storage"));
  return payload;
}

/* === Solicitudes === */
export async function crearSolicitud({ servicio, empresa, descripcion }) {
  const user = getCurrent();
  if (!user) throw new Error("Usuario no autenticado");

  const body = {
    servicio,
    empresa,
    descripcion,
    userEmail: user.email,
    userTelefono: user.telefono || user.celular || "",
  };

  const res = await fetch(`${API_URL}/api/solicitudes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al crear solicitud");
  return data;
}

export async function getSolicitudes() {
  const user = getCurrent();
  if (!user) return [];
  const res = await fetch(`${API_URL}/api/solicitudes/${encodeURIComponent(user.email)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener solicitudes");
  return data;
}

export async function saveRespuestaConArchivo(id, estado, respuesta, archivoFile) {
  let res;
  if (archivoFile) {
    const form = new FormData();
    form.append("estado", estado);
    form.append("respuesta", respuesta);
    form.append("archivo", archivoFile);

    res = await fetch(`${API_URL}/api/solicitudes/${id}/responder`, {
      method: "PUT",
      body: form,
    });
  } else {
    res = await fetch(`${API_URL}/api/solicitudes/${id}/responder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado, respuesta }),
    });
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al responder solicitud");
  return data;
}

/* === Empresas === */
export async function getEmpresas() {
  const res = await fetch(`${API_URL}/api/empresas`);
  const data = await res.json();
  return data;
}

export async function addEmpresa(empresaObj) {
  const res = await fetch(`${API_URL}/api/empresas/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(empresaObj),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al registrar empresa");
  return data;
}

/* === Calificación === */
export async function calificarSolicitud(id, calificacion) {
  const res = await fetch(`${API_URL}/api/solicitudes/${id}/calificar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ calificacion }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al calificar solicitud");
  return data;
}
/* === Actualizar solicitud (estado y notas) === */
export async function actualizarSolicitud(id, estado, notas, email) {
  const res = await fetch(`${API_URL}/api/solicitudes/${id}/actualizar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado, notas, email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al actualizar solicitud");
  return data;
}
