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
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      sucess: false,
      message: error?.name || "Something went wrong",
      error: error,
    });
  }
};

const getByIdFromDB = async (req: Request, res: Response) => {
  // console.log(req.params);
  const { id } = req.params;
  try {
    const result = await AdminService.getByIdFromDB(id);
    res.status(200).json({
      success: true,
      message: "Admin data fetch by id successfuly.",
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

const updateIntoDB = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminService.updateIntoDB(id, req.body);
    res.status(200).json({
      success: true,
      message: "Admin data updated successfuly.",
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
const deleteFromDB = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminService.deleteFromDB(id);
    res.status(200).json({
      success: true,
      message: "Admin data deleted successfuly.",
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
const softDeleteFromDB = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminService.softDeleteFromDB(id);
    res.status(200).json({
      success: true,
      message: "Admin data deleted successfuly.",
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
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB
};
