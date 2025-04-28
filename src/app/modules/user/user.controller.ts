import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin = async (req: Request, res: Response, next:NextFunction) => {

  // console.log(req.file);
  try {
    const result = await userService.createAdmin(req);
    res.status(200).json({
      success: true,
      message: "Admin Create Successfuly",
      data: result,
    });
  } catch (error:any) {
    res.status(500).json({
      sucess: false,
      message: error?.name || "Something went wrong",
      error:error
    });
  }
};
const createDoctor = async (req: Request, res: Response, next:NextFunction) => {

  // console.log(req.file);
  try {
    const result = await userService.createDoctor(req);
    res.status(200).json({
      success: true,
      message: "Doctor Create Successfuly",
      data: result,
    });
  } catch (error:any) {
    console.log(error);
    res.status(500).json({
      sucess: false,
      message: error?.name || "Something went wrong",
      error:error
    });
  }
};
const createPatient = async (req: Request, res: Response, next:NextFunction) => {

  // console.log(req.file);
  try {
    const result = await userService.createPatient(req);
    res.status(200).json({
      success: true,
      message: "Patient Create Successfuly",
      data: result,
    });
  } catch (error:any) {
    console.log(error);
    res.status(500).json({
      sucess: false,
      message: error?.name || "Something went wrong",
      error:error
    });
  }
};

export const userController = {
  createAdmin,
  createDoctor,
  createPatient
};
