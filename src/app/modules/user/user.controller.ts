import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";
import { userFilterableFields } from "./user.constant";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.file);
  try {
    const result = await userService.createAdmin(req);
    res.status(200).json({
      success: true,
      message: "Admin Create Successfuly",
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
const createDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(req.file);
  try {
    const result = await userService.createDoctor(req);
    res.status(200).json({
      success: true,
      message: "Doctor Create Successfuly",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      sucess: false,
      message: error?.name || "Something went wrong",
      error: error,
    });
  }
};
const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(req.file);
  try {
    const result = await userService.createPatient(req);
    res.status(200).json({
      success: true,
      message: "Patient Create Successfuly",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      sucess: false,
      message: error?.name || "Something went wrong",
      error: error,
    });
  }
};

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  // console.log({filters});

  // Pagination options

  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  // console.log('options', options);

  const result = await userService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User data fetch successfuly.",
    meta: result.meta,
    data: result.data,
  });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users profile status changed!",
    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    // console.log(req.user);
    const user = req.user;
    const result = await userService.getMyProfile(user);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "My profile data fetched!",
      data: result,
    });
  }
);

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  changeProfileStatus,
  getMyProfile,
};
