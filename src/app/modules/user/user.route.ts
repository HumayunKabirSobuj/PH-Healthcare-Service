import express, { Request, Response } from "express";
import { userController } from "./user.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { fileUplader } from "../../../helpars/fileUploader";

const router = express.Router();



router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUplader.upload.single("file"),
  // (req:Request, res:Response)
  userController.createAdmin
);

export const userRoutes = router;
