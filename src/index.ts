import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { router } from "./routers/mainRouter.js";
import { paymentRouter } from "./routers/paymentRouter.js";

dotenv.config();

const app = express();

app.use("/webhook/stripe", paymentRouter);

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

const startApp = () => {
  try {
    app.listen(3000, "0.0.0.0", () => {
      console.log("Server start");
    });
  } catch (error) {
    console.log(error);
  }
};

startApp();
