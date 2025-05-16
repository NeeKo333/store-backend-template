import { Router } from "express";
import { Response, Request } from "express";
import { userParams } from "../types/userRouter";

export const userRouter = Router();

userRouter.get("/:id", (req: Request<userParams>, res) => {
  const userId = req.params.id;
  res.status(200).send(userId);
});
