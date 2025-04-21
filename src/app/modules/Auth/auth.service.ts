import { UserStatus } from '@prisma/client';
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtHelpers } from "../../../helpars/jwtHelpers";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status:UserStatus.ACTIVE
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
    "abcdef",
    "5m"
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcdefghij",
    "30d"
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
    decodedData = jwtHelpers.verifyToken(token, "abcdefghij");
  } catch (err) {
    throw new Error("You are not authorized");
  }
  // console.log(decodedData);

  const userData = await prisma.user.findUnique({
    where: {
      email: decodedData.email,
      status:UserStatus.ACTIVE
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
    "abcdef",
    "5m"
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const AuthServices = {
  loginUser,
  refreshToken,
};
