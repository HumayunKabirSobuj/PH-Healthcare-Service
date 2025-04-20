import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
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

  const accessToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcdefg",
    { algorithm: "HS256", expiresIn: "5m" }
  );

  const refreshToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcdefgh",
    { algorithm: "HS256", expiresIn: "30d" }
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const AuthServices = {
  loginUser,
};
