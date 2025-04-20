import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, ...others } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly:true
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logged in successfully..",
    data: others,
  });
});

export const AuthController = {
  loginUser,
};
