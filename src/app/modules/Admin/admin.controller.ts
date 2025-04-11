import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";


const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, [
      "name",
      "email",
      "contactNumber",
      "searchTearm",
    ]);

    const result = await AdminService.getAllFromDB(filters);
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
