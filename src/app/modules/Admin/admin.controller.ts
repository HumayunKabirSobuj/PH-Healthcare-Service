import { Request, Response } from "express";
import { AdminService } from "./admin.service";

const getAllFromDB = async (req: Request, res: Response) => {
  //   console.log( req.query);
  try {
    const result = await AdminService.getAllFromDB(req.query);
    res.status(200).json({
      success: true,
      message: "Admin data fetch successfuly.",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      sucess: false,
      message: error?.name || "Something went wrong",
      error: error,
    });
  }
};

export const AdminController = {
  getAllFromDB,
};
