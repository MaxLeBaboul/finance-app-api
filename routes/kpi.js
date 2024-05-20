import express from "express";
import KPI from "../models/KPI.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const kpis = await KPI.find();
    res.status(200).json(kpis);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

export default router;
