import { Request, RequestHandler, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";
import catchAsync from "../../../shared/catchAsync";

const getAllFromDB: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, adminFilterableFields);
  // console.log({filters});

  // Pagination options

  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  // console.log('options', options);

  const result = await AdminService.getAllFromDB(filters, options);
  // res.status(200).json({
  //   success: true,
  //   message: "Admin data fetch successfuly.",
  //   meta: result.meta,
  //   data: result.data,
  // });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin data fetch successfuly.",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB: RequestHandler = catchAsync(async (req, res, next) => {
  // console.log(req.params);
  const { id } = req.params;

  const result = await AdminService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin data fetch by id successfuly.",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AdminService.updateIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin data updated successfuly.",
    data: result,
  });
});
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AdminService.deleteFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin data deleted successfuly.",
    data: result,
  });
});
const softDeleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AdminService.softDeleteFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin data deleted successfuly.",
    data: result,
  });
});

export const AdminController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
