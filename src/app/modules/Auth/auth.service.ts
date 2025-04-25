import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import emailSender from "./emailSender";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  // console.log(userData);
  if (!userData) {
    throw new Error("User not found..");
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.passsword
  );

  // console.log(isCorrectPassword);
  if (!isCorrectPassword) {
    throw new Error("Password Incorrect...");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (err) {
    throw new Error("You are not authorized");
  }
  // console.log(decodedData);

  const userData = await prisma.user.findUnique({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new Error("User not found.");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  // console.log(userData);

  if (!userData) {
    throw new ApiError(status.NOT_FOUND, "User not found.");
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.passsword
  );

  // console.log(isCorrectPassword);
  if (!isCorrectPassword) {
    throw new Error("Password Incorrect...");
  }

  // console.log(isCorrectPassword);

  const hashPassword = await bcrypt.hash(payload.newPassword, 12);

  // console.log(hashPassword);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      passsword: hashPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "password change successfully!",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  // console.log(payload);

  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  // console.log(userData);

  if (!userData) {
    throw new ApiError(status.NOT_FOUND, "Not Found!");
  }

  const resetPassToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_token_expires_in as string
  );

  // console.log(resetPassToken);

  // http://localhost:3000/reset-pass?email=humayun@gmail.com&token=fdklsjfdshfkdsjf

  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;

  // console.log(resetPassLink);

  await emailSender(
    userData.email,

    `<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; font-family: Arial, sans-serif; color: #333; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  <h2 style="color: #4f46e5; font-size: 22px; margin-bottom: 20px;">Reset Your Password</h2>
  <p style="font-size: 16px; margin-bottom: 10px;">Dear User,</p>
  <p style="font-size: 16px; margin-bottom: 20px;">
    You have requested to reset your password. Please click the button below to proceed:
  </p>
  <a href=${resetPassLink} style="text-decoration: none; display: inline-block;">
    <button style="background-color: #4f46e5; color: #fff; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer;">
      Reset Password
    </button>
  </a>
  <p style="font-size: 14px; margin-top: 30px; color: #666;">
    If you did not request a password reset, you can safely ignore this email.
  </p>
    </div>`
  );
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  // console.log({ token, payload });

  const userData = await prisma.user.findUnique({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  // console.log(userData);

  if (!userData) {
    throw new ApiError(status.NOT_FOUND, "User Not Found.");
  }

  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_secret as Secret
  );
  console.log(isValidToken);

  if (!(isValidToken.email === userData.email)) {
    throw new ApiError(status.FORBIDDEN, "Forbidden");
  }

  const hashPassword = await bcrypt.hash(payload.password, 12);

  await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      passsword: hashPassword,
    },
  });
};


export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
