import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AiRoutes from "./routes/AiRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", AiRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT =  5000;

app.listen(PORT, () => {
  console.log("Server running");
});