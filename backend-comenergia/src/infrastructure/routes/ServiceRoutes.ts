import express from "express";
import { getServices, saveService } from "../../interfaces/controllers/ServiceController";

const router = express.Router();

router.get("/", getServices);
router.post("/", saveService);

export default router;
