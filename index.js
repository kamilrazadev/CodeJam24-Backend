import express from "express";
import { config } from "dotenv";
import { connectDB } from "./config/dbConn.js";
import authRouter from "./Routes/authRoute.js";

const app = express();
config();

const port = process.env.PORT || 8000;
app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Server Running",
  });
});

connectDB();

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
