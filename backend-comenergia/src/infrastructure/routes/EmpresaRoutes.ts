import express from "express";
import { getEmpresas, addEmpresa } from "../../interfaces/controllers/EmpresaController";

const router = express.Router();

router.get("/", getEmpresas);
router.post("/add", addEmpresa);

export default router;
