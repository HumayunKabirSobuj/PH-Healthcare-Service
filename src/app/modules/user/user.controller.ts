import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {

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

export const userController = {
  createAdmin,
};
