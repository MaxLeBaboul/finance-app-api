import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import { kpis } from "./data/data.js";
import KPI from "./models/KPI.js";
import kpiRoutes from "./routes/kpi.js";

dotenv.config();

const PORT = process.env.PORT || 9000;

/* CONFIGURATION*/
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/kpis", kpiRoutes);

/* MONGOOSE AND SERVER SETUP */
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }

    await KPI.insertMany(kpis);
  })
  .catch((err) => {
    console.log(`${err} did not connect`);
  });