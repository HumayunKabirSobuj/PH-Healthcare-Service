import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    // console.log({filters});

    // Pagination options

    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    // console.log('options', options);

    const result = await AdminService.getAllFromDB(filters, options);
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
