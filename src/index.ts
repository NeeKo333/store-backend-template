import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { router } from "./routers/mainRouter.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

const startApp = () => {
  try {
    app.listen(3000, () => {
      console.log("Server start");
    });
  } catch (error) {
    console.log(error);
  }
};

startApp();
