import { Router } from "express";
import multer from "multer";
import {
  crearSolicitud,
  obtenerSolicitudes,
  responderSolicitud,
  calificarSolicitud,
  actualizarSolicitud, // <-- importarlo
} from "../../interfaces/controllers/solicitudController";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// === Rutas principales ===
router.post("/", crearSolicitud);
router.get("/:email", obtenerSolicitudes);

// === Responder solicitud (con archivo o sin archivo) ===
router.put("/:id/responder", upload.single("archivo"), responderSolicitud);

// === Calificar solicitud ===
router.put("/:id/calificar", calificarSolicitud);

// === Actualizar estado o notas ===
router.put("/:id/actualizar", actualizarSolicitud);

export default router;
